// Enable tooltips everywhere
document.addEventListener('DOMContentLoaded', function() {
  var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  var tooltipList = tooltipTriggerList.map(function(tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });

  // Auto-dismiss alerts after 5 seconds
  setTimeout(function() {
    var alerts = document.querySelectorAll('.alert');
    alerts.forEach(function(alert) {
      var bsAlert = new bootstrap.Alert(alert);
      bsAlert.close();
    });
  }, 5000);

  // Repository card click event
  var repoCards = document.querySelectorAll('.repo-card');
  repoCards.forEach(function(card) {
    card.addEventListener('click', function(e) {
      if (e.target.tagName !== 'A' && e.target.tagName !== 'BUTTON') {
        var link = card.querySelector('.repo-link');
        if (link) {
          link.click();
        }
      }
    });
  });
}); 