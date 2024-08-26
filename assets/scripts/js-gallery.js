class AENGallery extends HTMLElement {
  constructor() {
    super();

    this.movement_id;
    this.active_image_index = 0;

    // Needed to simulate a pause, not a full stop
    this.full_timing = 2000;
    this.elapsed_time = 0;
    this.movement_start_time = 0;
  }

  activateImage(image) {
    let upcoming_image = image || this.images[0];

    if (this.active_image && this.active_image.classList.contains("active")) {
      this.active_image.classList.remove("active");
    }

    upcoming_image.classList.add("active");

    this.active_image = upcoming_image;
  }

  movement() {
    this.elapsed_time = 0;

    this.switchToNextImage();

    this.startMovement();
  }

  startMovement() {
    if (!this.hasAttribute("moving")) {
      this.setAttribute("moving", "");
    }

    this.movement_start_time = new Date();

    this.movement_id = setTimeout(
      this.movement.bind(this),
      this.full_timing - this.elapsed_time
    );
  }

  pauseMovement() {
    this.removeAttribute("moving");

    clearTimeout(this.movement_id);
    this.movement_id = null;

    let time_from_start_to_pause = new Date() - this.movement_start_time;

    this.elapsed_time = Math.max(
      0,
      this.elapsed_time + time_from_start_to_pause
    );
  }

  restartMovement() {
    let isMoving = this.movement_id;

    clearTimeout(this.movement_id);
    this.movement_id = null;
    this.elapsed_time = 0;

    if (isMoving) {
      this.startMovement();
    }
  }

  switchToPrevImage() {
    let prev_index = this.active_image_index - 1;

    if (0 >= prev_index) {
      prev_index = this.images.length - 1;
    }

    this.activateImage(this.images[prev_index]);
    this.active_image_index = prev_index;
  }

  switchToNextImage() {
    let next_index = this.active_image_index + 1;

    if (next_index > this.images.length - 1) {
      next_index = 0;
    }

    this.activateImage(this.images[next_index]);
    this.active_image_index = next_index;
  }

  bindControllers() {
    this.controls.state.addEventListener("click", () => {
      if (this.movement_id) {
        return this.pauseMovement();
      }

      this.startMovement();
    });

    this.controls.prev.addEventListener("click", () => {
      this.switchToPrevImage();
      this.restartMovement();
    });

    this.controls.next.addEventListener("click", () => {
      this.switchToNextImage();
      this.restartMovement();
    });
  }

  connectedCallback() {
    this.controls = {
      prev: this.querySelector(".js-trigger-prev"),
      next: this.querySelector(".js-trigger-next"),
      state: this.querySelector(".js-trigger-state"),
    };

    this.images = Array.from(this.querySelectorAll(".js-gallery-image"));

    this.activateImage(this.querySelector(".js-gallery-image.active"));

    this.startMovement();
    this.bindControllers();
  }
}

customElements.define("aen-gallery", AENGallery);
