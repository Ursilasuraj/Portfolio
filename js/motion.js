// Subtle motion, added only as an enhancement: content is fully visible without this file.
//
//  1. Fade-in on scroll for cards and headings that start below the first screen.
//  2. Looping clips on project cards. A card opts in by putting data-loop-mp4 (and optionally
//     data-loop-webm, and data-loop-position to choose which part stays in frame) on its
//     .case-media element; the clip is fetched only when the card
//     scrolls into view and pauses when it leaves, so it costs nothing at page load.
//
// Visitors who ask their system for reduced motion get neither: the static image stays.
(function () {
  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // 1. Fade-in on scroll
  var targets = document.querySelectorAll(
    'main .section h2, main .card, main .mini-card, main .timeline-card, main .image-card, main .stat-grid, main .project-note, main .path-item'
  );
  var viewport = window.innerHeight;
  var reveal = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        reveal.unobserve(el);
        el.classList.add('is-visible');
        // Drop both classes once the fade is done so hover transitions behave normally again.
        window.setTimeout(function () {
          el.classList.remove('reveal', 'is-visible');
        }, 700);
      });
    },
    { rootMargin: '0px 0px -8% 0px' }
  );
  targets.forEach(function (el) {
    // Anything already on the first screen stays put: no flash of hidden content.
    if (el.getBoundingClientRect().top > viewport) {
      el.classList.add('reveal');
      reveal.observe(el);
    }
  });

  // 2. Looping project clips
  var loops = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        var media = entry.target;
        var video = media.querySelector('video');
        if (entry.isIntersecting) {
          if (!video) video = addClip(media);
          var playing = video.play();
          if (playing && playing.catch) playing.catch(function () {});
        } else if (video) {
          video.pause();
        }
      });
    },
    { threshold: 0.35 }
  );

  function addClip(media) {
    var video = document.createElement('video');
    video.className = 'case-loop';
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('aria-hidden', 'true');
    video.preload = 'auto';
    if (media.dataset.loopPosition) video.style.objectPosition = media.dataset.loopPosition;
    [['loopWebm', 'video/webm'], ['loopMp4', 'video/mp4']].forEach(function (pair) {
      var src = media.dataset[pair[0]];
      if (!src) return;
      var source = document.createElement('source');
      source.src = src;
      source.type = pair[1];
      video.appendChild(source);
    });
    video.addEventListener('playing', function () {
      media.classList.add('has-loop');
    });
    media.appendChild(video);
    return video;
  }

  document.querySelectorAll('.case-media[data-loop-mp4]').forEach(function (media) {
    loops.observe(media);
  });
})();
