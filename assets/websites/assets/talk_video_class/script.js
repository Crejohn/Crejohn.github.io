document.addEventListener('DOMContentLoaded', function() {
    // Lógica para el botón back-button
    function updateBackButtonPosition() {
        const backButton = document.getElementById('backButton');
        if (backButton) {
            backButton.style.right = '0px';
            backButton.style.position = 'fixed';
        }
    }
    updateBackButtonPosition();
    window.addEventListener('resize', updateBackButtonPosition);
    window.addEventListener('scroll', updateBackButtonPosition);
    const backButton = document.getElementById('backButton');
    if (backButton) {
        backButton.addEventListener('click', function() {
            window.location.href = '../../index.html';
        });
    }
    const menuItems = document.querySelectorAll('.menu-item');
    const upButton = document.getElementById('upButton');
    const downButton = document.getElementById('downButton');
    const selectionBar = document.getElementById('selectionBar');
    const defaultContent = document.getElementById('defaultContent');
    const servicesContent = document.getElementById('servicesContent');
    const loginContent = document.getElementById('loginContent');
    let currentSelectedIndex = 0;

    function initSelectionBar() {
        const firstItem = menuItems[0];
        const itemRect = firstItem.getBoundingClientRect();
        const menuRect = firstItem.parentElement.parentElement.getBoundingClientRect();
        
        selectionBar.style.top = (itemRect.top - menuRect.top) + 'px';
        selectionBar.style.height = itemRect.height + 'px';
    }

    function moveSelectionBar(index) {
        if (index < 0) index = 0;
        if (index >= menuItems.length) index = menuItems.length - 1;
        
        currentSelectedIndex = index;
        const selectedItem = menuItems[currentSelectedIndex];
        const itemRect = selectedItem.getBoundingClientRect();
        const menuRect = selectedItem.parentElement.parentElement.getBoundingClientRect();
        
        selectionBar.style.top = (itemRect.top - menuRect.top) + 'px';
        selectionBar.style.height = itemRect.height + 'px';
        
        selectedItem.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
        });
        
        // Obtener y mostrar el contenido correspondiente
        const contentType = selectedItem.querySelector('a').getAttribute('data-content');
        toggleContent(contentType);
    }

    function toggleContent(contentType) {
        // Ocultar todos los contenidos primero
        defaultContent.style.display = 'none';
        servicesContent.style.display = 'none';
        loginContent.style.display = 'none';

        // Mostrar el contenido seleccionado
        if (contentType === 'services') {
            servicesContent.style.display = 'block';
        } else if (contentType === 'login') {
            loginContent.style.display = 'block';
        } else {
            defaultContent.style.display = 'block';
        }
    }

    initSelectionBar();

    upButton.addEventListener('click', function() {
        moveSelectionBar(currentSelectedIndex - 1);
    });

    downButton.addEventListener('click', function() {
        moveSelectionBar(currentSelectedIndex + 1);
    });

    menuItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            moveSelectionBar(index);
        });
    });

    window.addEventListener('resize', function() {
        moveSelectionBar(currentSelectedIndex);
    });
    
    // Back Button Functionality


});