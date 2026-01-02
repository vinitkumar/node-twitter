/**
 * Node Twitter - Modern Vanilla JavaScript
 * Upgraded from jQuery to vanilla JS
 */

document.addEventListener('DOMContentLoaded', function() {
  
  // Favorite tweet handler
  document.querySelectorAll('.favorite').forEach(function(element) {
    element.addEventListener('click', async function(e) {
      const tweetID = e.currentTarget.dataset.tweetid;
      const url = 'tweets/' + tweetID + '/favorites';
      
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          console.log('send a favorite');
        } else {
          console.log('not sent');
        }
      } catch (error) {
        console.log('not sent', error);
      }
    });
  });

  // Follow/Unfollow user handler
  document.querySelectorAll('.profile__follow-button').forEach(function(element) {
    element.addEventListener('click', async function(e) {
      const button = e.currentTarget;
      const userID = button.dataset.userid;
      const url = '/users/' + userID + '/follow';
      
      if (button.classList.contains('following')) {
        button.textContent = 'Follow';
        button.classList.remove('following');
      } else {
        button.textContent = 'Unfollow';
        button.classList.add('following');
      }
      
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          console.log('Followed the user');
        } else {
          console.log('not sent');
        }
      } catch (error) {
        console.log('not sent', error);
      }
    });
  });

  // Edit tweet handler
  document.querySelectorAll('.tweet__edit').forEach(function(element) {
    element.addEventListener('click', function(e) {
      e.preventDefault();
      handleTweetEdit(e.target);
    });
  });

  function handleTweetEdit(editButton) {
    if (editButton.classList.contains('tweet__edit')) {
      // Change "edit" to "save" on the button
      editButton.textContent = 'Save';
      editButton.classList.remove('tweet__edit');
      editButton.classList.add('tweet__save');
      
      // Get the tweet content text
      const parentElement = editButton.parentElement;
      const tweetDescription = parentElement.parentElement;
      const originalTweet = tweetDescription.querySelector('.tweet__content');
      const tweetText = originalTweet.textContent;
      
      // Replace the tweet text element with a textarea element
      const modifiedText = document.createElement('textarea');
      modifiedText.classList.add('edit-tweet');
      modifiedText.value = tweetText;
      modifiedText.placeholder = tweetText;
      
      originalTweet.parentNode.insertBefore(modifiedText, originalTweet);
      originalTweet.remove();
      
    } else if (editButton.classList.contains('tweet__save')) {
      // Change "save" to "edit" on the button
      editButton.textContent = 'Edit';
      editButton.classList.remove('tweet__save');
      editButton.classList.add('tweet__edit');
      
      const parentElement = editButton.parentElement;
      const tweetDescription = parentElement.parentElement;
      const modifiedTweet = tweetDescription.querySelector('textarea');
      const originalText = modifiedTweet.placeholder;
      const modifiedText = modifiedTweet.value;
      
      if (modifiedText !== originalText) {
        // Make a POST request to /tweets/:id
        const tweet = editButton.closest('.tweet');
        const tweetId = tweet.dataset.tweetid;
        
        fetch(editButton.href, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: `id=${tweetId}&tweet=${encodeURIComponent(modifiedText)}`
        }).catch(error => console.log('Error updating tweet:', error));
      }
      
      // Replace hashtags with links
      const processedText = modifiedText.replace(/#(\w+)/g, '<a href="/tweets/hashtag/$1">#$1</a>');
      
      const tweetElement = document.createElement('p');
      tweetElement.classList.add('tweet__content');
      tweetElement.innerHTML = processedText;
      
      modifiedTweet.parentNode.insertBefore(tweetElement, modifiedTweet);
      modifiedTweet.remove();
    }
  }

  // Modal functionality (replacing Bootstrap modals)
  initModals();
});

/**
 * Custom Modal System - Replaces Bootstrap Modal functionality
 */
function initModals() {
  // Open modal on trigger click
  document.querySelectorAll('[data-modal-target]').forEach(function(trigger) {
    trigger.addEventListener('click', function(e) {
      e.preventDefault();
      const modalId = this.dataset.modalTarget;
      const modal = document.querySelector(modalId);
      if (modal) {
        openModal(modal);
      }
    });
  });

  // Legacy support for data-toggle="modal" (Bootstrap-style)
  document.querySelectorAll('[data-toggle="modal"]').forEach(function(trigger) {
    trigger.addEventListener('click', function(e) {
      e.preventDefault();
      const modalSelector = this.getAttribute('href') || this.dataset.target;
      const modal = document.querySelector(modalSelector);
      if (modal) {
        openModal(modal);
      }
    });
  });

  // Close modal on close button click
  document.querySelectorAll('[data-dismiss="modal"], [data-modal-close]').forEach(function(closeBtn) {
    closeBtn.addEventListener('click', function(e) {
      e.preventDefault();
      const modal = this.closest('.modal');
      if (modal) {
        closeModal(modal);
      }
    });
  });

  // Close modal on backdrop click
  document.querySelectorAll('.modal').forEach(function(modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === this) {
        closeModal(this);
      }
    });
  });

  // Close modal on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      const openModal = document.querySelector('.modal.show');
      if (openModal) {
        closeModal(openModal);
      }
    }
  });
}

function openModal(modal) {
  modal.classList.add('show');
  modal.style.display = 'block';
  document.body.style.overflow = 'hidden';
  
  // Add backdrop
  let backdrop = document.querySelector('.modal-backdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.classList.add('modal-backdrop');
    document.body.appendChild(backdrop);
  }
  backdrop.classList.add('show');
}

function closeModal(modal) {
  modal.classList.remove('show');
  modal.style.display = 'none';
  document.body.style.overflow = '';
  
  // Remove backdrop
  const backdrop = document.querySelector('.modal-backdrop');
  if (backdrop) {
    backdrop.classList.remove('show');
    backdrop.remove();
  }
}

// Export modal functions for external use
window.openModal = openModal;
window.closeModal = closeModal;
