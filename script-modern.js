document.addEventListener('DOMContentLoaded', () => {
    // Sidebar toggle
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const closeSidebar = document.getElementById('closeSidebar');

    // Form elements
    const subjectInput = document.getElementById('subjectInput');
    const addSubjectBtn = document.getElementById('addSubjectBtn');
    const subjectSelect = document.getElementById('subjectSelect');
    const filterSubject = document.getElementById('filterSubject');
    const cardTitle = document.getElementById('cardTitle');
    const cardContent = document.getElementById('cardContent');
    const cardTags = document.getElementById('cardTags');
    const addCardBtn = document.getElementById('addCardBtn');
    
    // Display elements
    const subjectsList = document.getElementById('subjectsList');
    const cardsContainer = document.getElementById('cardsContainer');
    const recentCardsList = document.getElementById('recentCardsList');
    const totalCards = document.getElementById('totalCards');
    const totalSubjects = document.getElementById('totalSubjects');
    const dashTotalCards = document.getElementById('dashTotalCards');
    const dashTotalSubjects = document.getElementById('dashTotalSubjects');
    const dashTotalTags = document.getElementById('dashTotalTags');
    const recentCount = document.getElementById('recentCount');
    
    // Modal elements
    const cardModal = document.getElementById('cardModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalContent = document.getElementById('modalContent');
    const modalTags = document.getElementById('modalTags');
    const editCardBtn = document.getElementById('editCardBtn');
    const deleteCardBtn = document.getElementById('deleteCardBtn');
    
    // Data
    let subjects = [];
    let cards = [];

    // Local storage functions
    function saveData() {
        localStorage.setItem('cardApp_subjects', JSON.stringify(subjects));
        localStorage.setItem('cardApp_cards', JSON.stringify(cards));
    }
    
    function loadData() {
        const savedSubjects = localStorage.getItem('cardApp_subjects');
        const savedCards = localStorage.getItem('cardApp_cards');
        
        if (savedSubjects) {
            subjects = JSON.parse(savedSubjects);
        }
        
        if (savedCards) {
            cards = JSON.parse(savedCards);
        }
    }

    // Sidebar functions
    function toggleSidebar() {
        sidebar.classList.toggle('open');
        sidebarOverlay.classList.toggle('show');
    }

    function closeSidebarFunc() {
        sidebar.classList.remove('open');
        sidebarOverlay.classList.remove('show');
    }

    sidebarToggle.addEventListener('click', toggleSidebar);
    closeSidebar.addEventListener('click', closeSidebarFunc);
    sidebarOverlay.addEventListener('click', closeSidebarFunc);

    // Navigation functions
    const navLinks = document.querySelectorAll('.nav-item');
    const contentSections = document.querySelectorAll('.content-section');

    function showSection(sectionId) {
        contentSections.forEach(section => {
            section.classList.remove('active');
        });

        const targetSection = document.getElementById(sectionId + '-section');
        if (targetSection) {
            targetSection.classList.add('active');
        }

        navLinks.forEach(link => {
            link.classList.remove('active');
        });

        const activeLink = document.querySelector(`[data-section="${sectionId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }

        if (window.innerWidth <= 768) {
            closeSidebarFunc();
        }
        
        // Update data when showing overview or cards section
        if (sectionId === 'overview' || sectionId === 'cards') {
            updateAll();
        }
    }

    // Make showSection global so it can be called from HTML
    window.showSection = showSection;
    
    // Brand click handler to show landing page
    const cardVaultBrand = document.getElementById('cardVaultBrand');
    if (cardVaultBrand) {
        cardVaultBrand.addEventListener('click', (e) => {
            e.preventDefault();
            showSection('landing');
        });
    }

    // Update Create First Card button to open modal instead
    function openCreateCardModal() {
        // Update modal subjects dropdown
        updateModalSubjects();
        new bootstrap.Modal(document.getElementById('createCardModal')).show();
    }

    // Make function global
    window.openCreateCardModal = openCreateCardModal;

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.getAttribute('data-section');
            showSection(section);
        });
    });

    // Update functions
    function updateStats() {
        const cardCount = cards.length;
        const subjectCount = subjects.length;
        const allTags = cards.flatMap(card => card.tags || []);
        const uniqueTags = [...new Set(allTags.filter(tag => tag))];
        const tagCount = uniqueTags.length;
        
        // Update sidebar stats
        if (totalCards) totalCards.textContent = cardCount;
        if (totalSubjects) totalSubjects.textContent = subjectCount;
        
        // Update dashboard stats
        if (dashTotalCards) dashTotalCards.textContent = cardCount;
        if (dashTotalSubjects) dashTotalSubjects.textContent = subjectCount;
        if (dashTotalTags) dashTotalTags.textContent = tagCount;
        if (recentCount) recentCount.textContent = Math.min(cardCount, 5);
    }
    
    function updateSubjects() {
        // Update sidebar filter
        if (filterSubject) {
            filterSubject.innerHTML = '<option value="">All Subjects</option>';
            subjects.forEach(subject => {
                const option = document.createElement('option');
                option.value = subject;
                option.textContent = subject;
                filterSubject.appendChild(option);
            });
        }
        
        // Update add card form
        if (subjectSelect) {
            subjectSelect.innerHTML = '<option value="">Choose a subject</option>';
            subjects.forEach(subject => {
                const option = document.createElement('option');
                option.value = subject;
                option.textContent = subject;
                subjectSelect.appendChild(option);
            });
        }
        
        // Update subjects list in overview
        if (subjectsList) {
            subjectsList.innerHTML = '';
            if (subjects.length === 0) {
                subjectsList.innerHTML = '<div class="text-muted">No subjects created yet</div>';
            } else {
                subjects.forEach(subject => {
                    const subjectDiv = document.createElement('div');
                    subjectDiv.className = 'subject-item d-flex justify-content-between align-items-center p-2 mb-2 bg-light rounded';
                    subjectDiv.innerHTML = `
                        <span>${subject}</span>
                        <small class="text-muted">${cards.filter(card => card.subject === subject).length} cards</small>
                    `;
                    subjectsList.appendChild(subjectDiv);
                });
            }
        }
    }
    
    function updateCards() {
        // Update cards container
        if (cardsContainer) {
            cardsContainer.innerHTML = '';
            if (cards.length === 0) {
                cardsContainer.innerHTML = '<div class="text-center text-muted py-5"><h5>No cards created yet</h5><p>Start by creating your first card!</p></div>';
            } else {
                cards.forEach(card => {
                    const cardDiv = document.createElement('div');
                    cardDiv.className = 'col-md-4 mb-4';
                    cardDiv.innerHTML = `
                        <div class="card h-100 shadow-sm" style="cursor: pointer;">
                            <div class="card-body">
                                <div class="d-flex justify-content-between align-items-start mb-2">
                                    <span class="badge bg-primary">${card.subject}</span>
                                </div>
                                <h6 class="card-title">${card.title}</h6>
                                <p class="card-text text-muted small">${card.content.substring(0, 100)}${card.content.length > 100 ? '...' : ''}</p>
                                ${card.tags && card.tags.length > 0 ? 
                                    '<div class="mt-2">' + card.tags.filter(tag => tag).map(tag => `<span class="badge bg-light text-dark me-1">${tag}</span>`).join('') + '</div>' : 
                                    ''
                                }
                            </div>
                        </div>
                    `;
                    cardDiv.addEventListener('click', () => openCardModal(card));
                    cardsContainer.appendChild(cardDiv);
                });
            }
        }
        
        // Update recent cards
        if (recentCardsList) {
            recentCardsList.innerHTML = '';
            const recentCards = cards.slice(-5).reverse();
            if (recentCards.length === 0) {
                recentCardsList.innerHTML = '<div class="text-muted">No recent cards</div>';
            } else {
                recentCards.forEach(card => {
                    const cardDiv = document.createElement('div');
                    cardDiv.className = 'recent-card-item d-flex justify-content-between align-items-center p-2 mb-2 bg-light rounded';
                    cardDiv.innerHTML = `
                        <div>
                            <div class="fw-bold">${card.title}</div>
                            <small class="text-muted">${card.subject}</small>
                        </div>
                    `;
                    cardDiv.style.cursor = 'pointer';
                    cardDiv.addEventListener('click', () => openCardModal(card));
                    recentCardsList.appendChild(cardDiv);
                });
            }
        }
    }
    
    function updateAll() {
        updateStats();
        updateSubjects();
        updateCards();
    }
    
    // Modal functions
    function openCardModal(card) {
        if (modalTitle) modalTitle.textContent = card.title;
        if (modalContent) modalContent.textContent = card.content;
        if (modalTags) {
            modalTags.innerHTML = card.tags && card.tags.length > 0 ? 
                card.tags.filter(tag => tag).map(tag => `<span class="badge bg-secondary me-1">${tag}</span>`).join('') : 
                '<span class="text-muted">No tags</span>';
        }
        
        if (editCardBtn) {
            editCardBtn.onclick = () => {
                // Pre-fill form with card data
                if (subjectSelect) subjectSelect.value = card.subject;
                if (cardTitle) cardTitle.value = card.title;
                if (cardContent) cardContent.value = card.content;
                if (cardTags) cardTags.value = card.tags ? card.tags.join(', ') : '';
                
                // Remove card from array
                const index = cards.indexOf(card);
                if (index > -1) {
                    cards.splice(index, 1);
                }
                
                // Close modal and show add card section
                bootstrap.Modal.getInstance(cardModal).hide();
                showSection('add-card');
                
                saveData();
                updateAll();
            };
        }
        
        if (deleteCardBtn) {
            deleteCardBtn.onclick = () => {
                if (confirm('Are you sure you want to delete this card?')) {
                    const index = cards.indexOf(card);
                    if (index > -1) {
                        cards.splice(index, 1);
                    }
                    
                    bootstrap.Modal.getInstance(cardModal).hide();
                    saveData();
                    updateAll();
                }
            };
        }
        
        new bootstrap.Modal(cardModal).show();
    }
    
    // Add subject functionality
    if (addSubjectBtn) {
        addSubjectBtn.addEventListener('click', () => {
            const subject = subjectInput.value.trim();
            
            if (!subject) {
                alert('Please enter a subject name');
                return;
            }
            
            if (subjects.includes(subject)) {
                alert('Subject already exists');
                return;
            }
            
            subjects.push(subject);
            subjectInput.value = '';
            
            saveData();
            updateAll();
            
            alert('Subject created successfully!');
        });
    }
    
    // Add card functionality
    if (addCardBtn) {
        addCardBtn.addEventListener('click', () => {
            const subject = subjectSelect.value;
            const title = cardTitle.value.trim();
            const content = cardContent.value.trim();
            const tags = cardTags.value.trim().split(',').map(tag => tag.trim()).filter(tag => tag);
            
            if (!subject) {
                alert('Please select a subject');
                return;
            }
            
            if (!title) {
                alert('Please enter a card title');
                return;
            }
            
            if (!content) {
                alert('Please enter card content');
                return;
            }
            
            const card = {
                subject,
                title,
                content,
                tags,
                created: new Date().toISOString()
            };
            
            cards.push(card);
            
            // Clear form
            subjectSelect.value = '';
            cardTitle.value = '';
            cardContent.value = '';
            cardTags.value = '';
            
            saveData();
            updateAll();
            
            alert('Card created successfully!');
        });
    }
    
    // Modal card creation functionality
    const modalSubjectSelect = document.getElementById('modalSubjectSelect');
    const newSubjectField = document.getElementById('newSubjectField');
    const newSubjectInput = document.getElementById('newSubjectInput');
    const modalCardTitle = document.getElementById('modalCardTitle');
    const modalCardContent = document.getElementById('modalCardContent');
    const modalCardTags = document.getElementById('modalCardTags');
    const modalAddCardBtn = document.getElementById('modalAddCardBtn');
    const cardTitleField = document.getElementById('cardTitleField');
    
    function updateModalSubjects() {
        if (modalSubjectSelect) {
            modalSubjectSelect.innerHTML = '<option value="">Choose a subject</option>';
            modalSubjectSelect.innerHTML += '<option value="__create_new__">+ Create new subject</option>';
            subjects.forEach(subject => {
                const option = document.createElement('option');
                option.value = subject;
                option.textContent = subject;
                modalSubjectSelect.appendChild(option);
            });
        }
    }
    
    // Handle subject selection change in modal
    if (modalSubjectSelect) {
        modalSubjectSelect.addEventListener('change', function() {
            if (this.value === '__create_new__') {
                newSubjectField.style.display = 'block';
                cardTitleField.className = 'col-md-12';
            } else {
                newSubjectField.style.display = 'none';
                cardTitleField.className = 'col-md-6';
            }
        });
    }
    
    // Modal add card functionality
    if (modalAddCardBtn) {
        modalAddCardBtn.addEventListener('click', () => {
            let selectedSubject = modalSubjectSelect.value;
            const title = modalCardTitle.value.trim();
            const content = modalCardContent.value.trim();
            const tags = modalCardTags.value.trim().split(',').map(tag => tag.trim()).filter(tag => tag);
            
            // If creating new subject
            if (selectedSubject === '__create_new__') {
                const newSubject = newSubjectInput.value.trim();
                if (!newSubject) {
                    alert('Please enter a new subject name');
                    return;
                }
                
                if (subjects.includes(newSubject)) {
                    alert('Subject already exists');
                    return;
                }
                
                subjects.push(newSubject);
                selectedSubject = newSubject;
            }
            
            if (!selectedSubject) {
                alert('Please select or create a subject');
                return;
            }
            
            if (!title) {
                alert('Please enter a card title');
                return;
            }
            
            if (!content) {
                alert('Please enter card content');
                return;
            }
            
            const card = {
                subject: selectedSubject,
                title,
                content,
                tags,
                created: new Date().toISOString()
            };
            
            cards.push(card);
            
            // Clear modal form
            modalSubjectSelect.value = '';
            modalCardTitle.value = '';
            modalCardContent.value = '';
            modalCardTags.value = '';
            newSubjectInput.value = '';
            newSubjectField.style.display = 'none';
            cardTitleField.className = 'col-md-6';
            
            // Close modal
            bootstrap.Modal.getInstance(document.getElementById('createCardModal')).hide();
            
            saveData();
            updateAll();
            
            alert('Card created successfully!');
        });
    }
    
    // Initialize
    loadData();
    updateAll();
    showSection('landing');
});

