// Eliminada funcionalidad de Back Button
// Variables globales
// (menu code removed)

// Inicializar cuando el documento esté listo
document.addEventListener('DOMContentLoaded', function(){

  // ensure Flip plugin is registered early to avoid later "I is not a function" errors
  if (typeof gsap !== 'undefined' && typeof Flip !== 'undefined') {
    if (!gsap.plugins || !gsap.plugins.Flip) {
      gsap.registerPlugin(Flip);
    }
  }

  // no page loader in this project any more
  // Agregar el evento de mousemove para la navegación al portfolio
  document.body.addEventListener('mousemove', function(e) {
      // Si el mouse está cerca del borde izquierdo (por ejemplo, < 30px)
      if (e.clientX < 30) {
          // Redirigir al portfolio si no estamos en un iframe
          if (window.self === window.top) {
              window.location.href = '../portfolio/index.html';
          }
      }
  });

  // Manejar clic en el icono home
  const pic1 = document.getElementById('pic1');
  if (pic1) {
    pic1.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      window.location.href = '../../index.html';
    });
  }

  // Navegación del menú flotante (igual que en flyer)
  function initFloatingMenuNav() {
    const menuItems = document.querySelectorAll('.menu li');
    menuItems.forEach(function(item) {
      item.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();

        const frameId = item.getAttribute('data-frame');
        let url = '';

        switch (frameId) {
          case 'portfolio-frame':
            url = '../portfolio/index.html';
            break;
          case 'logo-frame':
            url = '../branding/index.html';
            break;
          case 'graphic-frame':
            url = '../graphic_design/index.html';
            break;
          case 'website-frame':
            url = '../websites/index.html';
            break;
          case 'social-frame':
            url = '../social_media/index.html';
            break;
          case 'aboutme-frame':
            url = '../about/about/index.html';
            break;
          case 'timeline-frame':
            url = '../about/timeline/index.html';
            break;
          case 'contact-frame':
            url = '../contact/contact_form/index.html';
            break;
          default:
            url = '';
        }

        if (url) {
          window.location.href = url;
        }
      });
    });
  }

  initFloatingMenuNav();

  // Inicializar gallery (lightGallery removed)
  initGallery();
  // Habilitar apertura de image_structure por cada gallery container
  wireGalleryOpeners();

});

// class that encapsulates a single gallery instance using the image_structure logic
// ---------------------------------------------------------------------------
// Slide content logic
//
// Sources of text are pulled from the DOM itself.  Priority order:
//   1. `customSlideContent` array passed in by the caller via
//      `data-slide-content` on the group element (JSON).
//   2. explicit per-image attributes (`data-title` / `data-paragraph`).
//   3. markup inside `data-sub-html` (<h4> / <p>).
//
// If none of those are provided, we fall back to empty strings — gallery
// overlay still works but shows no caption. The old global
// `BRAND_SLIDE_CONTENT` constant has been removed; it is no longer present
// in the codebase and does not affect anything.


// helpers that adjust back-button so it never overlaps a vertical scrollbar
function getScrollbarWidth() {
  const div = document.createElement('div');
  div.style.visibility = 'hidden';
  div.style.overflow = 'scroll';
  div.style.msOverflowStyle = 'scrollbar';
  div.style.width = '100px';
  div.style.height = '100px';
  document.body.appendChild(div);
  const inner = document.createElement('div');
  inner.style.width = '100%';
  inner.style.height = '100%';
  div.appendChild(inner);
  const scrollbarWidth = div.offsetWidth - inner.offsetWidth;
  div.parentNode.removeChild(div);
  return scrollbarWidth;
}

// convert any CSS color to an rgba string using the provided opacity. this
// helper works with named colors, hex values, rgb/rgba, etc. it uses a
// temporary element and `getComputedStyle` to resolve the color into numeric
// components.
function colorWithOpacity(color, opacity) {
  const el = document.createElement('div');
  el.style.color = color;
  document.body.appendChild(el);
  const computed = getComputedStyle(el).color; // e.g. "rgb(255, 0, 0)"
  document.body.removeChild(el);
  const m = computed.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
  if (m) {
    return `rgba(${m[1]},${m[2]},${m[3]},${opacity})`;
  }
  // fallback, return original color (opacity ignored)
  return color;
}

function positionBackButton(backButton, container) {
  if (!backButton || !container) return;
  const containerRect = container.getBoundingClientRect();
  const buttonWidth = backButton.offsetWidth;
  const scrollbarWidth = getScrollbarWidth();
  let rightOffset = window.innerWidth - containerRect.right;
  if (rightOffset < scrollbarWidth) {
    rightOffset = scrollbarWidth;
  }
  if (rightOffset + buttonWidth > containerRect.width) {
    rightOffset = containerRect.width - buttonWidth;
    if (rightOffset < scrollbarWidth) rightOffset = scrollbarWidth;
  }
  backButton.style.right = rightOffset + 'px';
}

class ImageStructureGallery {
  constructor(images, customSlideContent) {
    this.images = images; // array of { href, subHtml, thumb }
    this.customSlideContent = Array.isArray(customSlideContent) ? customSlideContent : null;
    this.currentMode = 'grid';
    this.isAnimating = false;
    this.activeIndex = 0; // Start with the first image
    this.previousIndex = this.activeIndex;
    this.slideDirection = 'right';

    // build DOM from template and append to body
    const template = document.getElementById('image-structure-template');
    this.root = template.content.firstElementChild.cloneNode(true);
    document.body.appendChild(this.root);

    // create back-button inside the overlay so it only appears when a container
    // has been opened (not on the main branding grid page)
    this.backButton = document.createElement('div');
    this.backButton.className = 'back-button';
    // keep same id used elsewhere for consistency/debugging
    this.backButton.id = 'backButton';
    this.backButton.innerHTML = '<span><img src="https://cdn-icons-png.flaticon.com/512/2099/2099238.png" alt="Back icon" width="24" height="24" /></span>';
    this.root.appendChild(this.backButton);
    this.backButton.addEventListener('click', () => {
      // close overlay when clicked
      this.close();
    });

    // reposition routine bound to resize/scroll (removed in close())
    this._positionHandler = () => positionBackButton(this.backButton, this.root);
    window.addEventListener('resize', this._positionHandler);
    window.addEventListener('scroll', this._positionHandler);
    // call once immediately so button is correct even before user scrolls
    this._positionHandler();

    // grab scoped elements
    this.grid = this.root.querySelector('.grid');
    this.sliderImage = this.root.querySelector('.slider-image');
    this.sliderImageBg = this.root.querySelector('.slider-image-bg');
    this.sliderImageNext = this.root.querySelector('.slider-image-next');
    this.transitionOverlay = this.root.querySelector('.transition-overlay');
    this.content = this.root.querySelector('.content');
    this.contentTitleSpan = this.content.querySelector('.content-title span');
    this.contentParagraph = this.root.querySelector('.content-paragraph');
    this.contentBox = this.content.querySelector('.text-wrapper');
    this.thumbnailContainer = this.root.querySelector('.thumbnails');
    this.switchContainer = this.root.querySelector('.switch');
    this.switchGrid = this.switchContainer.querySelector('.switch-button-grid');
    this.switchSlider = this.switchContainer.querySelector('.switch-button-slider');

    // build gallery DOM (grid items + thumbnails)
    this.imageUrls = [];
    this.buildGalleryFromData();

    // loader removed from template; nothing to hide here

    // wire events for controls
    this.switchGrid.addEventListener('click', () => this.toggleView('grid'));
    this.switchSlider.addEventListener('click', () => this.toggleView('slider'));

    // Force initial button state to match currentMode ('grid')
    this.switchGrid.classList.add('switch-button-current');
    this.switchSlider.classList.remove('switch-button-current');

    // click thumbnails when in slider mode
    this.thumbnailContainer.querySelectorAll('.thumbnail').forEach(thumb => {
      thumb.addEventListener('click', (e) => {
        // thumbnails are only actionable when in slider mode
        if (this.currentMode !== 'slider' || this.isAnimating) return;
        const idx = parseInt(thumb.getAttribute('data-index'), 10);
        if (!isNaN(idx)) this.transitionToSlide(idx);
      });
    });

    // clicking grid items should either open the slider view (if we're still in grid) or
    // transition the slide when already in slider mode.  the goal is that selecting any image
    // behaves exactly like the user pressed the "slider" switch and then picked a slide.
    this.grid.addEventListener('click', (e) => {
      const item = e.target.closest('.grid-item');
      if (!item) return;
      const idx = parseInt(item.getAttribute('data-index'), 10);
      if (isNaN(idx) || this.isAnimating) return;

      if (this.currentMode !== 'slider') {
        // update active index so the opening animation targets the clicked image
        this.activeIndex = idx;
        this.previousIndex = idx;
        // highlight the thumbnail immediately so it stays at full opacity
        this.updateThumbnailActive(idx);
        // toggle to slider; we don't need to chain a transitionToSlide here because the
        // newly-set activeIndex will be used when the slider view appears.
        this.toggleView('slider');
      } else {
        this.transitionToSlide(idx);
      }
    });

    // extra behavior: resize adjustments
    window.addEventListener('resize', () => {
      if (this.currentMode === 'slider') {
        gsap.set(this.sliderImage, {
          width: '100vw',
          height: '100vh',
          x: 0,
          y: 0
        });
        this.sliderImage.style.backgroundSize = 'cover';
        this.sliderImage.style.backgroundPosition = 'center';
      }
    });

    // hover padding on switch buttons
    [this.switchGrid, this.switchSlider].forEach(button => {
      button.addEventListener('mouseenter', () => {
        if (button.classList.contains('switch-button-grid')) {
          this.switchContainer.style.paddingLeft = '30px';
        } else {
          this.switchContainer.style.paddingRight = '30px';
        }
      });
      button.addEventListener('mouseleave', () => {
        this.switchContainer.style.paddingLeft = '20px';
        this.switchContainer.style.paddingRight = '20px';
      });
    });

    // keyboard navigation (arrow keys)
    document.addEventListener('keydown', (e) => {
      if (this.currentMode !== 'slider' || this.isAnimating) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        const next = (this.activeIndex + 1) % this.imageUrls.length;
        this.transitionToSlide(next);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        const prev = (this.activeIndex - 1 + this.imageUrls.length) % this.imageUrls.length;
        this.transitionToSlide(prev);
      }
    });

    // wheel support for slider mode (scroll up/down to navigate)
    // using passive:false so we can prevent default page scrolling when
    // the overlay is open and user scrolls over it.
    document.addEventListener('wheel', (e) => {
      if (this.currentMode !== 'slider' || this.isAnimating) return;
      // don't let the background page scroll when wheel is used for navigation
      e.preventDefault();
      if (e.deltaY > 0) {
        const next = (this.activeIndex + 1) % this.imageUrls.length;
        this.transitionToSlide(next);
      } else if (e.deltaY < 0) {
        const prev = (this.activeIndex - 1 + this.imageUrls.length) % this.imageUrls.length;
        this.transitionToSlide(prev);
      }
    }, { passive: false });

    // touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    document.addEventListener('touchstart', (e) => {
      if (this.currentMode !== 'slider' || this.isAnimating) return;
      touchStartX = e.changedTouches[0].screenX;
    });
    document.addEventListener('touchend', (e) => {
      if (this.currentMode !== 'slider' || this.isAnimating) return;
      touchEndX = e.changedTouches[0].screenX;
      const threshold = 50;
      if (touchEndX < touchStartX - threshold) {
        const next = (this.activeIndex + 1) % this.imageUrls.length;
        this.transitionToSlide(next);
      } else if (touchEndX > touchStartX + threshold) {
        const prev = (this.activeIndex - 1 + this.imageUrls.length) % this.imageUrls.length;
        this.transitionToSlide(prev);
      }
    });

    // allow closing with Esc or clicking on background overlay
    this.root.addEventListener('click', (e) => {
      if (e.target === this.root) {
        this.close();
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.close();
    });

    // initialize gsap eases globally if not already done
    if (typeof CustomEase !== 'undefined' && !ImageStructureGallery.easiesCreated) {
      CustomEase.create('mainEase', 'M0,0 C0.65,0.05 0.36,1 1,1');
      CustomEase.create('sideEase', 'M0,0 C0.86,0 0.07,1 1,1');
      ImageStructureGallery.easiesCreated = true;
    }

    // show grid by default
    this.updateContent(this.activeIndex);
  }

  buildGalleryFromData() {
    this.grid.innerHTML = '';
    this.thumbnailContainer.innerHTML = '';

    this.images.forEach((imgObj, idx) => {
      const div = document.createElement('div');
      div.className = 'grid-item'; // Removed 'target' class to prevent grid reordering
      div.setAttribute('data-index', idx);
      const inner = document.createElement('div');
      inner.className = 'grid-item-img';
      inner.style.backgroundImage = `url("${imgObj.href}")`;
      div.appendChild(inner);
      this.grid.appendChild(div);

      const thumb = document.createElement('div');
      thumb.className = 'thumbnail' + (idx === this.activeIndex ? ' active' : '');
      thumb.setAttribute('data-index', idx);
      const thumbInner = document.createElement('div');
      thumbInner.className = 'thumbnail-img';
      thumbInner.style.backgroundImage = `url("${imgObj.href}")`;
      thumb.appendChild(thumbInner);
      this.thumbnailContainer.appendChild(thumb);

      // store the CSS-safe background-image string rather than
      // raw href so later assignments work without extra wrapping
      this.imageUrls.push(`url("${imgObj.href}")`);
    });

    // highlight the starting thumbnail (in case activeIndex was changed before
    // building or to ensure consistent state when slider opens)
    this.updateThumbnailActive(this.activeIndex);

    // build slideContent array; allow an override object set by the
    // caller (each gallery container can provide its own JSON). if no
    // override exists we fall back to the global BRAND_SLIDE_CONTENT used
    // in the demo, and lastly parse the `data-sub-html` from the link.
    this.slideContent = [];
    for (let i = 0; i < this.images.length; i++) {
      // 1. explicit override object passed from the container
      if (this.customSlideContent && this.customSlideContent[i]) {
        this.slideContent.push(this.customSlideContent[i]);
        continue;
      }

      // 2. explicit per-image attributes (data-title / data-paragraph)
      if (this.images[i].title || this.images[i].paragraph) {
        this.slideContent.push({ title: this.images[i].title || '', paragraph: this.images[i].paragraph || '' });
        continue;
      }

      // 3. per-image markup (data-sub-html on <a> tags)
      const temp = document.createElement('div');
      temp.innerHTML = this.images[i].subHtml || '';
      const h4 = temp.querySelector('h4');
      const p = temp.querySelector('p');
      if (h4 || p) {
        this.slideContent.push({ title: h4 ? h4.textContent : '', paragraph: p ? p.textContent : '' });
        continue;
      }

      // 4. nothing supplied; push empty placeholders
      this.slideContent.push({ title: '', paragraph: '' });
    }
  }

  updateContent(index) {
    const content = this.slideContent[index] || { title: '', paragraph: '' };
    this.contentTitleSpan.textContent = content.title;
    this.contentParagraph.textContent = content.paragraph;

    if (this.contentBox) {
      const hasText = Boolean(content.title || content.paragraph);
      this.contentBox.style.display = hasText ? 'inline-block' : 'none';
    }
  }

  toggleView(mode) {
    // return a promise so callers can react when the transition completes.  if we're
    // already animating or already in the requested mode we resolve immediately.
    if (this.isAnimating || this.currentMode === mode) {
      return Promise.resolve();
    }
    this.isAnimating = true;

    // Update buttons using cached references
    if (mode === 'grid') {
      this.switchGrid.classList.add('switch-button-current');
      this.switchSlider.classList.remove('switch-button-current');
    } else {
      this.switchGrid.classList.remove('switch-button-current');
      this.switchSlider.classList.add('switch-button-current');
    }

    this.currentMode = mode;

    if (mode === 'slider') {
      // make sure thumbnail visuals reflect the current active index
      this.updateThumbnailActive(this.activeIndex);
      return this.showSliderView().then(() => {
        this.isAnimating = false;
      });
    } else {
      return this.showGridView().then(() => {
        this.isAnimating = false;
      });
    }
  }

  showSliderView() {
    return new Promise(resolve => {
      try {
        // determine starting rectangle
        let activeItemRect;
        const activeItem = this.grid.querySelector(`.grid-item[data-index="${this.activeIndex}"]`);
        if (!activeItem) throw new Error('activeItem not found in grid');
        activeItemRect = activeItem.getBoundingClientRect();
        const activeImageUrl = this.imageUrls[this.activeIndex];

        this.sliderImage.style.backgroundImage = activeImageUrl;
        this.sliderImageBg.style.backgroundImage = activeImageUrl;
        this.sliderImage.style.backgroundSize = 'cover';
        this.sliderImage.style.backgroundPosition = 'center';
        this.sliderImageBg.style.backgroundSize = 'cover';
        this.sliderImageBg.style.backgroundPosition = 'center';
        this.sliderImageNext.style.backgroundSize = 'cover';
        this.sliderImageNext.style.backgroundPosition = 'center';

        this.updateContent(this.activeIndex);

        gsap.set(this.sliderImage, {
          width: activeItemRect.width,
          height: activeItemRect.height,
          x: activeItemRect.left,
          y: activeItemRect.top,
          opacity: 1,
          visibility: 'visible'
        });

        const heightState = Flip.getState(this.sliderImage);

        gsap.set(this.sliderImage, {
          height: '100vh',
          y: 0,
          width: activeItemRect.width,
          x: activeItemRect.left
        });

        Flip.from(heightState, {
          duration: ImageStructureGallery.TIMING.BASE,
          ease: 'mainEase',
          onComplete: () => {
            const widthState = Flip.getState(this.sliderImage);
            gsap.set(this.sliderImage, { width: '100vw', x: 0 });
            Flip.from(widthState, {
              duration: ImageStructureGallery.TIMING.BASE,
              ease: 'mainEase',
              onComplete: () => {
                gsap.to(this.grid, { opacity: 0, duration: ImageStructureGallery.TIMING.SHORTEST, ease: 'power2.inOut' });
                const contentTl = gsap.timeline({ onComplete: resolve });
                contentTl.to(this.content, { opacity: 1, duration: ImageStructureGallery.TIMING.SHORT, ease: 'mainEase' }, 0);
                if (this.contentBox) {
                  contentTl.to(this.contentBox, { opacity: 1, duration: ImageStructureGallery.TIMING.BASE, ease: 'mainEase' }, 0);
                }
                contentTl.to(this.contentTitleSpan, { y: 0, duration: ImageStructureGallery.TIMING.BASE, ease: 'sideEase' }, ImageStructureGallery.TIMING.STAGGER_TINY);
                contentTl.to(this.contentParagraph, { opacity: 1, duration: ImageStructureGallery.TIMING.BASE, ease: 'mainEase' }, ImageStructureGallery.TIMING.STAGGER_SMALL);
                contentTl.to(this.thumbnailContainer.children, { opacity: 1, y: 0, duration: ImageStructureGallery.TIMING.SHORT, stagger: ImageStructureGallery.TIMING.STAGGER_TINY, ease: 'sideEase' }, ImageStructureGallery.TIMING.STAGGER_MED);
              }
            });
          }
        });
      } catch (err) {
        console.error('[ImageStructureGallery] showSliderView error, falling back to grid', err);
        // if Flip misbehaves, just resolve and let user try again
        resolve();
      }
    });
  }

  showGridView() {
    return new Promise(resolve => {
      try {
        const activeItem = this.grid.querySelector(`.grid-item[data-index="${this.activeIndex}"]`);
        if (!activeItem) throw new Error('activeItem not found in grid');
        const activeItemRect = activeItem.getBoundingClientRect();
        const contentTl = gsap.timeline({ onComplete: () => {
            gsap.to(this.grid, { opacity: 1, duration: ImageStructureGallery.TIMING.SHORTEST, ease: 'power2.inOut' });
            gsap.set([this.sliderImageNext, this.sliderImageBg, this.transitionOverlay], { opacity: 0, visibility: 'hidden' });
            const widthState = Flip.getState(this.sliderImage);
            gsap.set(this.sliderImage, { width: activeItemRect.width, x: activeItemRect.left, height: '100vh', y: 0 });
            Flip.from(widthState, {
              duration: ImageStructureGallery.TIMING.BASE,
              ease: 'mainEase',
              onComplete: () => {
                const heightState = Flip.getState(this.sliderImage);
                gsap.set(this.sliderImage, { height: activeItemRect.height, y: activeItemRect.top });
                Flip.from(heightState, {
                  duration: ImageStructureGallery.TIMING.BASE,
                  ease: 'mainEase',
                  onComplete: () => {
                    gsap.to(this.sliderImage, {
                      opacity: 0,
                      duration: ImageStructureGallery.TIMING.SHORTEST,
                      ease: 'power2.inOut',
                      onComplete: () => {
                        this.sliderImage.style.visibility = 'hidden';
                        resolve();
                      }
                    });
                  }
                });
              }
            });
          }});

        contentTl.to(this.thumbnailContainer.children, { opacity: 0, y: 20, duration: ImageStructureGallery.TIMING.SHORT, stagger: -ImageStructureGallery.TIMING.STAGGER_TINY, ease: 'sideEase' }, 0);
        if (this.contentBox) {
          contentTl.to(this.contentBox, { opacity: 0, duration: ImageStructureGallery.TIMING.SHORT, ease: 'mainEase' }, 0);
        }
        contentTl.to(this.contentParagraph, { opacity: 0, duration: ImageStructureGallery.TIMING.SHORT, ease: 'mainEase' }, ImageStructureGallery.TIMING.STAGGER_TINY);
        contentTl.to(this.contentTitleSpan, { y: '100%', duration: ImageStructureGallery.TIMING.SHORT, ease: 'sideEase' }, ImageStructureGallery.TIMING.STAGGER_SMALL);
        contentTl.to(this.content, { opacity: 0, duration: ImageStructureGallery.TIMING.SHORT, ease: 'mainEase' }, ImageStructureGallery.TIMING.STAGGER_MED);
      } catch (err) {
        console.error('[ImageStructureGallery] showGridView error, falling back to grid', err);
        resolve();
      }
    });
  }

  transitionToSlide(index) {
    if (this.isAnimating || index === this.activeIndex) return;
    this.isAnimating = true;
    this.slideDirection = index > this.activeIndex ? 'right' : 'left';
    this.previousIndex = this.activeIndex;

    // update thumbnail visuals (helper will clear previous and add new)
    this.updateThumbnailActive(index);

    const newImageUrl = this.imageUrls[index];

    // prepare transition layers
    this.sliderImageNext.style.backgroundImage = newImageUrl;
    this.sliderImageBg.style.backgroundImage = newImageUrl;

    // ensure consistent sizing/positioning
    this.sliderImage.style.backgroundSize = 'cover';
    this.sliderImage.style.backgroundPosition = 'center';
    this.sliderImageBg.style.backgroundSize = 'cover';
    this.sliderImageBg.style.backgroundPosition = 'center';
    this.sliderImageNext.style.backgroundSize = 'cover';
    this.sliderImageNext.style.backgroundPosition = 'center';

    gsap.set([this.sliderImageNext, this.sliderImageBg], { visibility: 'visible' });
    const xOffset = this.slideDirection === 'right' ? '100%' : '-100%';

    gsap.set(this.sliderImageNext, { x: xOffset, y: 0, opacity: 1, width: '100vw', height: '100vh' });

    // improved background layer setup (no stray y offset, fixed size)
    gsap.set(this.sliderImageBg, {
      x: xOffset,
      y: 0,
      opacity: 0.9,
      width: '100vw',
      height: '100vh',
      scale: 1
    });

    // build master timeline that hides old content, animates slides, then shows new content
    const masterTl = gsap.timeline({
      onComplete: () => {
        // swap main image and reset transition layers
        this.sliderImage.style.backgroundImage = newImageUrl;
        gsap.set([this.sliderImageNext, this.sliderImageBg, this.transitionOverlay], {
          opacity: 0,
          x: 0,
          y: 0,
          visibility: 'hidden'
        });
        gsap.set(this.sliderImage, { x: 0, opacity: 1 });

        // update content text and show it with animation
        this.activeIndex = index;
        this.updateContent(index);
        const showTl = gsap.timeline({ onComplete: () => { this.isAnimating = false; } });
        if (this.contentBox) {
          showTl.to(this.contentBox, { opacity: 1, duration: ImageStructureGallery.TIMING.BASE, ease: 'mainEase' }, 0);
        }
        showTl.to(this.contentTitleSpan, { y: 0, duration: ImageStructureGallery.TIMING.BASE, ease: 'sideEase' }, 0);
        showTl.to(this.contentParagraph, { opacity: 1, duration: ImageStructureGallery.TIMING.BASE, ease: 'mainEase' }, ImageStructureGallery.TIMING.STAGGER_SMALL);
      }
    });

    // hide current content immediately
    if (this.contentBox) {
      masterTl.to(this.contentBox, { opacity: 0, duration: ImageStructureGallery.TIMING.SHORT, ease: 'mainEase' }, 0);
    }
    masterTl.to(this.contentTitleSpan, { y: '100%', duration: ImageStructureGallery.TIMING.SHORT, ease: 'sideEase' }, ImageStructureGallery.TIMING.STAGGER_TINY);

    // overlay flash effect
    masterTl.to(this.transitionOverlay, { opacity: 0.15, duration: ImageStructureGallery.TIMING.SHORTEST, ease: 'power1.in' }, ImageStructureGallery.TIMING.STAGGER_SMALL);
    masterTl.to(this.transitionOverlay, { opacity: 0, duration: ImageStructureGallery.TIMING.SHORT, ease: 'power1.out' }, ImageStructureGallery.TIMING.STAGGER_MED);

    // push the current slide away
    masterTl.to(this.sliderImage, {
      x: this.slideDirection === 'right' ? '-35%' : '35%',
      opacity: 1,
      duration: ImageStructureGallery.TIMING.LONG,
      ease: 'mainEase'
    }, 0);

    // move background layer subtly
    masterTl.to(this.sliderImageBg, {
      x: this.slideDirection === 'right' ? '-10%' : '10%',
      y: 0,
      opacity: 0.95,
      scale: 1,
      duration: ImageStructureGallery.TIMING.LONG,
      ease: 'sideEase'
    }, ImageStructureGallery.TIMING.STAGGER_TINY);

    // bring next image into view
    masterTl.to(this.sliderImageNext, {
      x: 0,
      opacity: 1,
      duration: ImageStructureGallery.TIMING.LONG,
      ease: 'sideEase'
    }, ImageStructureGallery.TIMING.STAGGER_SMALL);
  }

  // helper used in several places to keep thumbnail classes updated
  updateThumbnailActive(idx) {
    const thumbs = this.thumbnailContainer.querySelectorAll('.thumbnail');
    thumbs.forEach(t => {
      t.classList.remove('active');
      const img = t.querySelector('.thumbnail-img');
      if (img) img.style.opacity = 0.6;
    });
    const newThumb = this.thumbnailContainer.querySelector(`.thumbnail[data-index="${idx}"]`);
    if (newThumb) {
      newThumb.classList.add('active');
      const img = newThumb.querySelector('.thumbnail-img');
      if (img) img.style.opacity = 1;
    }
  }

  // convenience method
  open() {
    // make sure overlay is visible and reset its scroll position
    this.root.style.display = 'block';
    this.root.scrollTop = 0;

    // prevent background content from scrolling
    document.body.style.overflow = 'hidden';
    document.body.classList.remove('loading');
  }

  close() {
    // restore body scrolling
    document.body.style.overflow = '';
    // remove listeners created in constructor
    if (this._positionHandler) {
      window.removeEventListener('resize', this._positionHandler);
      window.removeEventListener('scroll', this._positionHandler);
      this._positionHandler = null;
    }
    if (this.root && this.root.parentNode) {
      this.root.parentNode.removeChild(this.root);
    }
  }
}

// timing constants stored on the class so all instances share the same values
ImageStructureGallery.TIMING = {
  BASE: 0.512,
  SHORTEST: 0.256,
  SHORT: 0.384,
  LONG: 0.768,
  LONGEST: 1.024,
  STAGGER_TINY: 0.032,
  STAGGER_SMALL: 0.064,
  STAGGER_MED: 0.128,
  PAUSE: 1.536
};

// replace wireGalleryOpeners implementation
function wireGalleryOpeners() {
  // make sure Flip is registered in case this function runs before $(document).ready
  if (typeof gsap !== 'undefined' && typeof Flip !== 'undefined' && (!gsap.plugins || !gsap.plugins.Flip)) {
    gsap.registerPlugin(Flip);
  }

  const groups = document.querySelectorAll('#gallery-container .gallery-container.group');
  groups.forEach(groupEl => {
    // Do not write defaults into the DOM dataset: modifying `dataset` can
    // unintentionally change layout/positioning for containers that rely on
    // implicit/legacy behavior. Instead, defaults are applied at overlay
    // render time only when no per-container attribute is provided.
    // if the element has a data-cover attribute, apply it as a background
    // and mark the element so the stylesheet will size it appropriately.
    let coverUrl = groupEl.getAttribute('data-cover');
    // fallback: use first anchor's image src when no explicit cover set
    if (!coverUrl) {
      const firstImg = groupEl.querySelector('a > img');
      if (firstImg) {
        coverUrl = firstImg.src;
      }
    }
    if (coverUrl) {
      groupEl.style.backgroundImage = `url('${coverUrl}')`;
      groupEl.classList.add('has-cover');
    }

    const openGallery = (e) => {
      e.preventDefault();
      e.stopPropagation();
      // only collect anchors that actually point to gallery images; skip
      // any anchor that has the "cover" class or is a placeholder
      const images = Array.from(groupEl.querySelectorAll('a'))
        .filter(a => !a.classList.contains('cover'))
        .map(a => ({
          href: a.href,
          subHtml: a.getAttribute('data-sub-html') || '',
          // new simple attributes for inline editing
          title: a.getAttribute('data-title') || '',
          paragraph: a.getAttribute('data-paragraph') || '',
          thumb: a.getAttribute('data-thumb') || ''
        }));
      let customData = null;
      if (groupEl.dataset && groupEl.dataset.slideContent) {
        try {
          customData = JSON.parse(groupEl.dataset.slideContent);
        } catch (err) {
          console.warn('[wireGalleryOpeners] invalid JSON in data-slide-content', err);
        }
      }
      const gallery = new ImageStructureGallery(images, customData);
      // expose for debugging in devtools
      try {
        window.lastImageStructureGallery = gallery;
      } catch (e) {
        console.warn('[wireGalleryOpeners] could not expose gallery on window', e);
      }
      // Start with the first image
      gallery.activeIndex = 0;
      gallery.previousIndex = gallery.activeIndex;

      // show overlay
      gallery.open();

      // apply per-container overrides (if provided on the group element)
      try {
        const contentEl = gallery.content;
        if (contentEl && groupEl && groupEl.dataset) {
          // position: expects tokens like 'top-left', 'center', 'bottom-right'
          if (groupEl.dataset.contentPos) {
            contentEl.classList.add('position-' + groupEl.dataset.contentPos);
          }
          // sizes and paddings: set CSS variables so stylesheet controls layout
          // per-group data attributes determine overlay styling.
          if (groupEl.dataset.titleSize) {
            contentEl.style.setProperty('--logo-design-title-size', groupEl.dataset.titleSize);
          }
          if (groupEl.dataset.paragraphSize) {
            contentEl.style.setProperty('--overlay-paragraph-size', groupEl.dataset.paragraphSize);
          }
          if (groupEl.dataset.paddingVertical) {
            contentEl.style.setProperty('--overlay-padding-vertical', groupEl.dataset.paddingVertical);
          }
          if (groupEl.dataset.paddingHorizontal) {
            contentEl.style.setProperty('--overlay-padding-horizontal', groupEl.dataset.paddingHorizontal);
          }
          if (groupEl.dataset.titleTextColor) {
            contentEl.style.setProperty('--overlay-title-text-color', groupEl.dataset.titleTextColor);
          }
          if (groupEl.dataset.paragraphTextColor) {
            contentEl.style.setProperty('--overlay-paragraph-text-color', groupEl.dataset.paragraphTextColor);
          }
          // custom background color/opacity for the text box (recuadro).
          // attributes supported:
          //   data-box-color   -> any valid CSS colour
          //   data-box-opacity -> number between 0 and 1
          // If only opacity is supplied we adjust the default background value.
          if (groupEl.dataset.boxColor || groupEl.dataset.boxOpacity) {
            let bg = null;
            const color = groupEl.dataset.boxColor;
            const opacity = groupEl.dataset.boxOpacity;
            if (color && opacity != null) {
              bg = colorWithOpacity(color, opacity);
            } else if (color) {
              bg = color;
            } else if (opacity != null) {
              const defaultBg = getComputedStyle(document.documentElement).getPropertyValue('--overlay-box-bg') || '';
              bg = colorWithOpacity(defaultBg || 'rgba(255,255,255,0.4)', opacity);
            }
            if (bg) {
              contentEl.style.setProperty('--overlay-box-bg', bg);
            }
          }
        }
      } catch (e) {
        console.warn('[wireGalleryOpeners] failed to apply per-container overrides', e);
      }



      // note: we no longer auto-toggle to slider; let the user click the switch
      // manually so the behaviour matches the original brand demo.  This also
      // avoids confusion where the "SLIDER" button appears non-functional
      // because it is already active.

    };

    groupEl.addEventListener('click', openGallery);
    // also bind directly to first anchor so navigation cannot escape before handler
    const firstAnchor = groupEl.querySelector('a');
    if (firstAnchor) {
      firstAnchor.addEventListener('click', openGallery);
    }
  });
}

// back-button logic is now handled inside ImageStructureGallery constructor
// which appends the button to the overlay when a container is opened

function initGallery() {
  // lightGallery removed — no pre-sizing required for main project
}

// lightGallery cleanup removed — not used in main project

// menu-related helpers removed (not needed)

// nothing else after gallery closing logic


