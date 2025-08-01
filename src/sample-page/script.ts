// Sample page interactive functionality
document.addEventListener('DOMContentLoaded', function(): void {
    
    // Theme toggle functionality
    const themeToggle = document.getElementById('themeToggle') as HTMLButtonElement;
    const body = document.body;
    
    themeToggle.addEventListener('click', function() {
        body.classList.toggle('dark-theme');
        
        // Update button text based on current theme
        if (body.classList.contains('dark-theme')) {
            themeToggle.textContent = 'Toggle Light Mode';
        } else {
            themeToggle.textContent = 'Toggle Dark Mode';
        }
        
        // Add a visual feedback animation
        themeToggle.style.transform = 'scale(0.95)';
        setTimeout(() => {
            themeToggle.style.transform = 'scale(1)';
        }, 150);
    });
    
    // Modal functionality
    const showModalBtn = document.getElementById('showModal') as HTMLButtonElement;
    const modal = document.getElementById('modal') as HTMLDivElement;
    const closeBtn = document.querySelector('.close') as HTMLSpanElement;
    
    showModalBtn.addEventListener('click', function() {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
    });
    
    closeBtn.addEventListener('click', function() {
        closeModal();
    });
    
    // Close modal when clicking outside of it
    modal.addEventListener('click', function(event: MouseEvent): void {
        if (event.target === modal) {
            closeModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(event: KeyboardEvent): void {
        if (event.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });
    
    function closeModal(): void {
        modal.classList.remove('show');
        document.body.style.overflow = ''; // Restore scrolling
    }
    
    // Add some interactive hover effects to feature cards
    const featureCards = document.querySelectorAll('.feature-card') as NodeListOf<HTMLDivElement>;
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function(this: HTMLDivElement): void {
            this.style.borderColor = '#007bff';
        });
        
        card.addEventListener('mouseleave', function(this: HTMLDivElement): void {
            this.style.borderColor = '';
        });
    });
    
    // Smooth scroll for navigation links (if they had actual targets)
    const navLinks = document.querySelectorAll('.nav-link') as NodeListOf<HTMLAnchorElement>;
    navLinks.forEach(link => {
        link.addEventListener('click', function(this: HTMLAnchorElement, e: MouseEvent): void {
            e.preventDefault();
            // Add a visual feedback
            this.style.opacity = '0.6';
            setTimeout(() => {
                this.style.opacity = '';
            }, 200);
        });
    });
});