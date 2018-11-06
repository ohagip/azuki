const defaultSlideTime = 0.5;

/**
 * Custom slider
 */

class CustomSlider {
  constructor(selector, info, className, startFadeInTime) {
    // super();
    this.$target = $(selector);
    this.info = info;
    this.className = className || 'slider';
    this.$cover = this.$target.find(`.${this.className}_cover`);
    this.$slides = this.$target.find(`.${this.className}_item`);
    this.$pagerIcons = null;
    this.$pagerBars = null;

    this.currentIndex = 0;
    this.slideLength = 0;
    this.startFadeInTime = startFadeInTime || 0;
    this.tween = null;
    this.isDisable = true;
    this.isPause = false;
    this.isSeek = false;
    this.isFirst = true;

    this.onClickPagerIcon = this.onClickPagerIcon.bind(this);
    this.prev = this.prev.bind(this);
    this.next = this.next.bind(this);
  }

  init() {
    const info = this.info;
    if (Array.isArray(info) === false) {
      return;
    }
    this.slideLength = info.length;
    this.info = info;
    let i = 0;
    let pagerHTML = '';

    for (; i < this.slideLength; i += 1) {
      pagerHTML += `<div class="${this.className}_icon"><div class="${
        this.className
      }_bar"></div></div>`;
    }

    this.$target.find(`.${this.className}_pager`).html(pagerHTML);
    this.$pagerIcons = this.$target.find(`.${this.className}_icon`);
    this.$pagerBars = this.$target.find(`.${this.className}_bar`);
    TweenMax.set(this.$pagerBars, { x: '-100%' });

    this.$pagerIcons.on('click', this.onClickPagerIcon);
    this.$target.find('.mc-slider_prev').on('click', this.prev);
    this.$target.find('.mc-slider_next').on('click', this.next);

    this.$slides.hide();
    this.$slides.eq(this.currentIndex).show();
    this.unCover(this.startFadeInTime);
  }

  onClickPagerIcon(e) {
    if (this.isDisable === true) {
      return;
    }
    const $target = $(e.currentTarget);
    const targetIndex = this.$pagerIcons.index($target);
    if (targetIndex === this.currentIndex) {
      return;
    }
    this.play();
    this.changeSlide(targetIndex);
  }

  changeSlide(nextIndex) {
    if (this.tween !== null) {
      this.tween.kill();
    }
    // TweenMax.killTweensOf(this.$pagerBars.eq(this.currentIndex));
    this.cover(0.5)
      .then(() => {
        this.$slides.eq(this.currentIndex).hide();
        this.$slides.eq(nextIndex).show();
        if ($.isFunction(this.info[this.currentIndex].exit) === true) {
          this.info[this.currentIndex].exit.call(this, this, this.$slides[this.currentIndex]);
        }
        const $dfd = $.Deferred();
        setTimeout(() => {
          $dfd.resolve();
        }, 10);
        return $dfd.promise();
      })
      .then(() => {
        this.currentIndex = nextIndex;
        this.unCover(0.6);
        if (this.isPause === false) {
          if ($.isFunction(this.info[nextIndex].enter) === true) {
            this.info[nextIndex].enter.call(this, this.$slides[nextIndex]);
          }
          this.setPager(this.currentIndex, this.info[this.currentIndex].time || defaultSlideTime);
        }
      });
  }

  start() {
    if (this.isFirst === false) {
      return;
    }
    this.isFirst = false;
    this.init();
    this.setPager(this.currentIndex, this.info[this.currentIndex].time || defaultSlideTime);
    if ($.isFunction(this.info[this.currentIndex].enter) === true) {
      this.info[this.currentIndex].enter.call(this, this.$slides[this.currentIndex]);
    }
  }

  play() {
    if (this.isFirst === true) {
      return;
    }
    if (this.isPause === false) {
      return;
    }
    this.isPause = false;
    if (this.isSeek === true) {
      this.tween.play();
    } else {
      if ($.isFunction(this.info[this.currentIndex].enter) === true) {
        this.info[this.currentIndex].enter.call(this, this.$slides[this.currentIndex]);
      }
      this.setPager(this.currentIndex, this.info[this.currentIndex].time || defaultSlideTime);
    }
  }

  pause() {
    if (this.isPause === true) {
      return;
    }
    this.isPause = true;
    if (this.isSeek === true && this.tween !== null) {
      this.tween.pause();
    }
  }

  prev() {
    if (this.isDisable === true) {
      return;
    }
    if (this.currentIndex === 0) {
      this.changeSlide(this.slideLength - 1);
    } else {
      this.changeSlide(this.currentIndex - 1);
    }
  }

  next() {
    if (this.isDisable === true) {
      return;
    }
    if (this.currentIndex === this.slideLength - 1) {
      this.changeSlide(0);
    } else {
      this.changeSlide(this.currentIndex + 1);
    }
  }

  setPager(idx, time) {
    if (idx === undefined || time === undefined) {
      return;
    }
    this.isSeek = true;
    this.$pagerIcons.removeClass('is-active');
    this.$pagerIcons.eq(idx).addClass('is-active');
    TweenMax.set(this.$pagerBars.slice(0, idx), { x: '0%' });
    TweenMax.set(this.$pagerBars.slice(idx + 1), { x: '-100%' });
    TweenMax.set(this.$pagerBars.eq(idx), { x: '-100%' });
    if (this.isPause === false) {
      this.tween = TweenMax.to(this.$pagerBars.eq(idx), time, {
        x: '0%',
        ease: Power0.easeNone,
        onComplete: () => {
          this.isSeek = false;
          this.next();
        },
      });
    }
  }

  /**
   * cover
   * @param {Number} _time
   * @return {jQUery.promise}
   */
  cover(_time) {
    const time = _time || 0;
    const $dfd = $.Deferred();
    if (this.isDisable === true) {
      $dfd.resolve();
      return $dfd.promise();
    }

    this.isDisable = true;
    this.$cover.show();
    TweenMax.to(this.$cover, time, {
      alpha: 1,
      onComplete: () => {
        $dfd.resolve();
      },
    });

    return $dfd.promise();
  }

  unCover(_time) {
    const time = _time || 0;
    const $dfd = $.Deferred();
    if (this.isDisable === false) {
      $dfd.resolve();
      return $dfd.promise();
    }

    TweenMax.to(this.$cover, time, {
      alpha: 0,
      onComplete: () => {
        this.$cover.hide();
        this.isDisable = false;
        $dfd.resolve();
      },
    });
    return $dfd.promise();
  }

  destroy() {
    if (this.tween !== null) {
      this.tween.kill();
    }
    this.$pagerIcons.off('click', this.onClickPagerIcon);
    this.$target.find(`.${this.className}_pager`).empty();
    this.$slides.show();
  }
}

export default CustomSlider;
