// Wait for the document to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
    // Select all columns in the promotion section
    const promotionColumns = document.querySelectorAll('.promotion-section .col');
    const displayTime = 2000; // Time (in ms) all columns stay visible together
    const delayTime = 1000;   // Time delay (in ms) between each column's appearance

    function startAnimationLoop() {
        // Hide all columns initially
        promotionColumns.forEach((column) => {
            column.style.opacity = 0;
            column.style.transform = 'translateY(50px)';
        });

        // Animate each column into view sequentially
        promotionColumns.forEach((column, index) => {
            setTimeout(() => {
                column.style.opacity = 1;
                column.style.transform = 'translateY(0)';
            }, index * delayTime);
        });

        // After all columns are visible, keep them visible for displayTime, then hide them all together
        setTimeout(() => {
            promotionColumns.forEach((column) => {
                column.style.opacity = 0;
                column.style.transform = 'translateY(50px)';
            });
        }, promotionColumns.length * delayTime + displayTime);

        // Restart the animation loop after display time plus the appearance time of all columns
        setTimeout(() => {
            startAnimationLoop();
        }, promotionColumns.length * delayTime + displayTime + 1000); // 1000ms is added to pause before restarting
    }

    // Start the animation loop
    startAnimationLoop();
});
