// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function () {
    // Get elements
    const bell = document.querySelector('.bell');
    const icon1 = document.querySelector('.icon1');
    const bellPopup = document.getElementById('bell-popup');
    const icon1Popup = document.getElementById('icon1-popup');
    const closeButtons = document.querySelectorAll('.popup-close');

    // Function to toggle popup
    function togglePopup(popup) {
        if (popup.classList.contains('active')) {
            popup.classList.remove('active');
        } else {
            // Close other popups if open
            document.querySelectorAll('.popup').forEach(p => p.classList.remove('active'));
            popup.classList.add('active');
        }
    }

    // Event listeners for opening popups
    bell.addEventListener('click', function () {
        togglePopup(bellPopup);
    });

    icon1.addEventListener('click', function () {
        togglePopup(icon1Popup);
    });

    // Event listeners for closing popups
    closeButtons.forEach(button => {
        button.addEventListener('click', function () {
            const popup = button.closest('.popup');
            popup.classList.remove('active');
        });
    });

    // Close popup if clicking outside
    document.addEventListener('click', function (event) {
        if (!event.target.closest('.popup') && !event.target.closest('.bell') && !event.target.closest('.icon1')) {
            document.querySelectorAll('.popup').forEach(popup => popup.classList.remove('active'));
        }
    });
});