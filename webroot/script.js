/** @typedef {import('../src/message.ts').DevvitSystemMessage} DevvitSystemMessage */
/** @typedef {import('../src/message.ts').WebViewMessage} WebViewMessage */

class App {
  constructor() {
    this.counter = 0;
    this.total_blocks_stacked = 0;
    this.intro = document.getElementById("intro");
    this.leaderboard = document.getElementById("leaderboard");
    this.gameplay = document.getElementById("gameplay");
    this.screen = document.getElementById("screen");
    this.button_container = document.getElementById("button_container");
    this.how_to_play = document.getElementById("how-to-play")
    this.landing_box = document.getElementById("landing_box");
    this.gameplay_background = document.getElementById("gameplay_bg");
    this.controller = document.getElementById("controller");
    this.fall_distance = 550;
    this.building_container = document.getElementById("building");
    this.building_base = document.getElementById("base");
    this.score_card = document.getElementById("current_score");
    this.cloud_container = document.getElementById("cloud_container");
    this.game_over_bg = document.getElementById("game_over_bg");
    this.rain_section = document.getElementById("rain_sec");
    this.asteroid_container = document.getElementById("asteroid_con");
    this.moon = document.getElementById("moon");
    this.reaction = document.getElementById("reaction");
    this.thread = document.getElementById("swing_thread");
    this.welcome_message = document.getElementById("welcome");
    this.prev_element = null;
    this.bg_position = 0;
    this.current_block_element;
    this.max_score = document.getElementById("max_score");
   this.perfect_blocks_stacked = 0;

    this.game_over_box = document.getElementById("game_over");
    this.high_score_box = document.getElementById("high_score");
    this.disqualified_box = document.getElementById("disqualified");
    this.leaderboard_data = [];

    this.asteroid_container_y = 200;

    this.highest_score = 0;
    this.username = "";
    this.loading_game = true;

    let planets = [],
      currPlanet = 1;

    // audios
    this.backgroundAudio = new Audio(
      "./assets/game-background-music-default.mp3"
    );
    let blockAudio = new Audio("./assets/block-2.mp3");
    let prefectBlockAudio = new Audio("./assets/perfect.mp3");
    let rainAudio = new Audio("./assets/rain-sound.mp3");
    let thunderAudio = new Audio("./assets/thunder.mp3");
    let disqualifiedAudio = new Audio("./assets/resize.mp3");
    let highScoreAudio = new Audio("./assets/high-score.mp3");
    let gameOverAudio = new Audio("./assets/game-over.mp3");
    let winnerAudio = new Audio("./assets/winner.mp3")

    let maxSwing = 0;
    let duration = 5;

    this.leaderboard_btn = document.getElementById("leaderboard-btn");
    this.how_to_play_btn = document.getElementById("how-to-play-btn")
    this.play_btn = document.getElementById("play-btn");
    this.retry_btn = document.getElementById("retry-btn");
    this.exit_btn = document.getElementById("exit-btn");

    // buttons function
    this.play_btn.addEventListener("click", () => {
      this.restartGame();
    });

    this.retry_btn.addEventListener("click", () => {
      this.restartGame();
    });

    this.leaderboard_btn.addEventListener("click", () => {
      const isActive = this.leaderboard_btn.classList.contains("active");
    
      this.intro.style.display = isActive ? "block" : "none";
      this.gameplay.style.display = "none";
      this.leaderboard.style.display = isActive ? "none" : "block";
    
      this.leaderboard_btn.innerText = isActive ? "Leaderboard" : "Go Back";
      this.leaderboard_btn.classList.toggle("active");
    
      // Disable/Enable "How To Play" button
      this.how_to_play_btn.disabled = !isActive;
    
      if (!isActive) {
        this.welcome_message.innerText = "Leaderboard"
        this.how_to_play_btn.classList.remove("active");
        this.how_to_play_btn.innerText = "How To Play";
      }else{
        this.welcome_message.innerText = `Welcome ${this.username}`
      }
    
      postWebViewMessage({ type: "leaderboard" });
    });
    
    this.how_to_play_btn.addEventListener("click", () => {
      const isActive = this.how_to_play_btn.classList.contains("active");
    
      this.how_to_play.style.display = isActive ? "none" : "flex";
      this.intro.style.display = isActive ? "block" : "none";
    
      this.how_to_play_btn.innerText = isActive ? "How To Play" : "Go Back";
      this.how_to_play_btn.classList.toggle("active");
    
      // Disable/Enable "Leaderboard" button
      this.leaderboard_btn.disabled = !isActive;
    
      if (!isActive) {
        this.welcome_message.innerText = "How To Play"
        this.leaderboard_btn.classList.remove("active");
        this.leaderboard_btn.innerText = "Leaderboard";
      }else{
        this.welcome_message.innerText = `Welcome ${this.username}`
      }
    });
    

    this.exit_btn.addEventListener("click", () => {
      this.screen.style.height = "400px";
      this.intro.style.display = "flex";
      this.gameplay.style.display = "none";
      this.leaderboard.style.display = "none";
      this.button_container.style.display = "flex";
      this.landing_box.style.maxWidth = "600px";
      this.landing_box.style.width = "90%";
      this.game_over_bg.style.display = "none";
      this.welcome_message.style.display = "block";
      this.pauseAllAudio();
    });

   

    this.pauseAllAudio = () => {
      blockAudio.pause();
      prefectBlockAudio.pause();
      rainAudio.pause();
      thunderAudio.pause();
      disqualifiedAudio.pause();
      highScoreAudio.pause();
      gameOverAudio.pause();
    };

    this.restartGame = () => {
      this.screen.classList.remove("rain", "night", "space")
      this.screen.classList.add("morning");

      this.asteroid_container_y = 200;
      this.total_blocks_stacked = 0;
      this.counter = 0;
      this.score_card.innerText = 0;
      this.bg_position = 0;
      this.perfect_blocks_stacked = 0;

      maxSwing = 0;
      duration = 5;
      

      this.welcome_message.style.display = "none";
      this.intro.style.display = "none";
      this.leaderboard.style.display = "none";
      this.button_container.style.display = "none";
      this.building_container.style.animation = "none";
      this.game_over_bg.style.display = "none";

      this.gameplay.style.display = "flex";
      this.screen.style.height = "100dvh";
      this.landing_box.style.maxWidth = "100%";
      this.landing_box.style.width = "100%";

      
      this.building_container.innerHTML = "";
      this.cloud_container.innerHTML = "";
      this.asteroid_container.innerHTML = "";
      this.fall_distance = 550;
      this.building_container.style.top = "0%";
      this.gameplay_background.style.bottom = "0%";
      this.thread.getAnimations()[0].updatePlaybackRate(1)
      this.createNewBlock(0);
      this.prev_element = null;
      this.pauseAllAudio();
    };

    this.createNewBlock = (total_stacked) => {
      let current_block_id = `${Math.floor(Math.random() * 100000000000000)}-${
        this.gameplay.childNodes.length
      }`;
      const block = document.createElement("figure");
      block.classList.add("building_block");
      block.style.position = "absolute";
      block.style.transition = "0.2s ease-in-out";
      block.style.top = "10px";
      block.style.left = "-37px";
      block.classList.add("new-block");
      block.id = `${current_block_id}`;

      const img = document.createElement("img");
      if (total_stacked == 0) {
        img.src = "./assets/buildings/reddit/flat-base.PNG";
      } else {
        img.src = "./assets/buildings/reddit/flat-block.PNG";
      }
      img.alt = "Building Block";

      block.appendChild(img);
      this.current_block_element = block;
      this.thread.appendChild(block);
    };

    const showGameOver  = (type, data = {})=> {
      document.querySelectorAll(".game_message").forEach(el => el.classList.add("hidden"));
      this.game_over_bg.style.display = "flex"
    
      if (type === "high_score") {
        document.getElementById("high_score").classList.remove("hidden");
        document.getElementById("prev_high_score").textContent = this.highest_score || 0;
        document.getElementById("new_high_score").textContent = this.total_blocks_stacked || 0;
      } 
      else if (type === "disqualified") {
        document.getElementById("disqualified").classList.remove("hidden");
      } 
      else if (type === "game_over") {
        document.getElementById("game_over").classList.remove("hidden");
        document.getElementById("max_score").textContent = this.highest_score || 0;
        document.getElementById("your_score").textContent = this.total_blocks_stacked || 0;
        document.getElementById("perfect_blocks").textContent = this.perfect_blocks_stacked || 0;
      }
    }
  
  

    // building block swinging animation
    const animateBuildings = (buildings) => {
      if (this.total_blocks_stacked < 4) return;
      buildings.forEach((building, index) => {
        if (building.style.animation) return;

        maxSwing = Math.min(maxSwing, 35);
        duration = Math.max(duration, 1);

        let keyframes = `
            @keyframes swing_${index} {
                0% { transform: translateX(0px); }
                50% {transform:translateX(${maxSwing}px)}
                100% { transform: translateX(-${maxSwing}px); }
            }
        `;

        // Create and append the animation style
        let styleTag = document.createElement("style");
        styleTag.innerHTML = keyframes;
        document.head.appendChild(styleTag);

        // Apply animation
        setTimeout(() => {
          if (building.style.animation) return;
          building.style.animation = `swing_${index} ease-in-out ${duration}s infinite alternate`;
        }, 200);
      });
      maxSwing += 0.4;
      duration -= 0.05;
    };

    // Example: Function to handle dynamically added elements
    function updateBuildings() {
      let cloneChildren = document.querySelectorAll(".block_added");
      animateBuildings(cloneChildren);
    }

    // Returns  building block's landing location based on rotation and current location
    const animateFall = (element, topPos, fallDistance, prevElement) => {
      const rect = element.getBoundingClientRect();
      const prevElementRect = this.prev_element?.getBoundingClientRect();
      const containerRect = this.building_container.getBoundingClientRect();
      const startX = Math.floor(rect.left);
      const startY = topPos;

      const computedStyle = window.getComputedStyle(element);
      const transform = computedStyle.transform;

      let angle = 0;
      if (transform !== "none") {
        const matrix = new DOMMatrix(transform);
        angle = Math.atan2(matrix.b, matrix.a);
      }

      const newX = Math.floor(
        Math.abs(startX + fallDistance * Math.sin(angle))
      );
      let newY = 0;

      if (prevElement) {
        if (this.total_blocks_stacked >= (window.innerHeight  < 600 ? 2 : 4)) {
          newY = 
            Math.round(prevElementRect.top) -
            (this.total_blocks_stacked - (window.innerHeight  < 600 ? 1 : 3)) * 90;
        } else {
          newY = Math.round(prevElementRect?.top) - 90;
        }
      } else {
        newY = Math.floor(startY + fallDistance * Math.cos(angle));
      }

      element.style.left = `${newX}px`;
      element.style.top = `${newY}px`;

      return { newX, newY };
    };

    function getRotationAngle(transformValue) {
      if (transformValue === "none") return "rotate(0deg)";

      const values = transformValue.match(/matrix\((.+)\)/);
      if (!values) return "rotate(0deg)";

      const matrixValues = values[1].split(", ").map(parseFloat);
      const a = matrixValues[0]; // cos(θ)
      const b = matrixValues[1]; // sin(θ)

      const angle = Math.atan2(b, a) * (180 / Math.PI); // Convert to degrees
      return angle.toFixed(4);
    }

    // Main Game Logic

    let prevX = 0;
    let isOccupied = false;

    this.controller.addEventListener("click", () => {

      const rect = this.current_block_element.getBoundingClientRect();
      const computedStyle = window.getComputedStyle(this.thread);
      const transformValue = computedStyle.getPropertyValue("transform");
      const final_transform_value = getRotationAngle(transformValue);

      this.thread.removeChild(this.current_block_element);
      let cloneChild = this.current_block_element;
      this.current_block_element = cloneChild;
      let extra_pad = 0;
      let extra_pad_top = 0;

      if (final_transform_value < -20) {
        extra_pad = 60;
        extra_pad_top = 40;
      } else if (final_transform_value > 20) {
        extra_pad = -30;
        extra_pad_top = 40;
      }

      cloneChild.style.left = `${Math.floor(rect.left) + extra_pad}px`;
      // block falling position
      if (this.total_blocks_stacked >= (window.innerHeight  < 600 ? 2 : 4)) {
        cloneChild.style.top = `-${
          90 * (this.total_blocks_stacked - (window.innerHeight  < 600 ? 1 : 3)) - 150
        }px`;
      } else {
        cloneChild.style.top = `${Math.floor(rect.top) + 42 + extra_pad_top}px`;
      }
      cloneChild.style.transform = `rotate(${final_transform_value}deg)`;
      cloneChild.classList.add("block_added");
      this.building_container.prepend(cloneChild);
      this.thread.innerHTML = "";
      extra_pad_top = 0;
      cloneChild.style.transform = "rotate(0deg)";
      updateBuildings();
      this.thread
        .getAnimations()[0]
        .updatePlaybackRate(
          Math.min(this.thread.getAnimations()[0].playbackRate + 0.005, 2)
        );
      let distance =
        (window.innerWidth < 700
          ? window.innerHeight - 180
          : window.innerHeight - 200) -
        this.total_blocks_stacked * 90;
      const { newX, newY } = animateFall(
        cloneChild,
        Math.floor(rect.top) + 42,
        distance,
        this.prev_element
      );
      setTimeout(() => {
        this.createNewBlock(this.total_blocks_stacked + 1);
      }, 400);

      if (this.prev_element) {
        let validPlay = this.isValidPlay(newX, newY);
        if (validPlay) {
          if (this.total_blocks_stacked >= (window.innerHeight  < 600 ? 2 : 4)) {
            this.gameplay_background.style.bottom = `-${
              this.bg_position + 10
            }%`;
            this.building_container.style.top = `${
              (this.total_blocks_stacked - (window.innerHeight  < 600 ? 1 : 3)) * 90
            }px`;
            Array.from(this.cloud_container.children).forEach((node) => {
              let getRect = node.getBoundingClientRect();
              let newTop = Math.floor(getRect.top) + 90; // Move down instead of up
              node.style.top = `${newTop}px`;
            });

            Array.from(this.asteroid_container.children).forEach((node) => {
              let getRect = node.getBoundingClientRect();
              let newTop = Math.floor(getRect.top) + 90; // Move down instead of up
              node.style.top = `${newTop}px`;
            });

            if (this.total_blocks_stacked >= 110) {
              if (planets.length > 0) {
                // Ensure there's at least one planet
                let planetRect = planets[0].getBoundingClientRect();
                let newTop = Math.floor(planetRect.top) + 90;
                planets[0].style.top = `${newTop}px`;
              }

              if (
                [110, 140, 170, 200, 230, 260, 290].includes(
                  this.total_blocks_stacked
                )
              ) {
                if (planets.length > 0) {
                  // Ensure there's a planet to remove
                  let prevPlanet = planets.pop();
                  this.gameplay.removeChild(prevPlanet);
                }
                handlePlant(newX, this.total_blocks_stacked);
              }
            }

            switch (true) {
              case this.total_blocks_stacked >= 100:
                this.screen.classList.add("space");
                this.screen.classList.remove("night", "rain");
                rainAudio.pause();
                break;

              case this.total_blocks_stacked >= 80 &&
                this.total_blocks_stacked < 100:
                this.screen.classList.add("night", "rain");
                this.screen.classList.remove("morning");
                rainAudio.play();
                setTimeout(() => {
                  this.thunderAnimation();
                }, Math.floor(Math.random() * 7000) + 1000);
                break;

              case this.total_blocks_stacked >= 60 &&
                this.total_blocks_stacked < 80:
                this.screen.classList.add("morning");
                this.screen.classList.remove("night", "rain");
                rainAudio.pause();
                break;

              case this.total_blocks_stacked >= 40 &&
                this.total_blocks_stacked < 60:
                this.screen.classList.add("night");
                this.screen.classList.remove("morning", "rain");
                rainAudio.pause();
                break;

              case this.total_blocks_stacked >= 20 &&
                this.total_blocks_stacked < 40:
                this.screen.classList.add("rain");
                this.screen.classList.remove("morning", "night");
                rainAudio.pause();
                setTimeout(() => {
                  this.thunderAnimation();
                }, Math.floor(Math.random() * 5000) + 1000);
                break;

              default:
                this.screen.classList.add("morning");
                this.screen.classList.remove("night", "rain", "space");
                break;
            }
            this.bg_position += 10;
          }
        }
      } else {
        blockAudio.play();
      }
      this.prev_element = cloneChild;
      this.score_card.innerText = `${this.total_blocks_stacked}`;
      let prevElementRect = this.prev_element?.getBoundingClientRect();
      prevX = prevElementRect.left;
      this.total_blocks_stacked += 1;
      if(this.total_blocks_stacked == 340) {
        this.pauseAllAudio();
        winnerAudio.play();
        this.screen.innerHTML = `
         <div id="winner" class="winner">
            <div class="topside"></div>
            <div class="winner_content">
              <h2>🏆 Congratulations, ${this.username}! 🏆</h2>
              <img src="./assets/winner.jpg" alt="Champion">
              <p>
                You have conquered every challenge and ascended to the <span>Pinnacle Of Greatness</span>.  
                Your unwavering determination and unmatched <span>Aura</span> set you apart— <span>A True Legend!</span>.  
              </p>
            </div>
            <div class="bottomside"></div>
          </div>
        `
      }
    });

    window.onresize = () => {
     if(this.total_blocks_stacked > 0) {
      showGameOver("disqualified");
      if(this.total_blocks_stacked > this.highest_score) {
        postWebViewMessage({
          type: "updateHighScore",
          data: {
            username: this.username,
            newHighScore: this.total_blocks_stacked,
          },
        });
      }
      disqualifiedAudio.play();
     }
    };

    this.isValidPlay = async (newX, newY) => {
      let prevElemRect = this.prev_element.getBoundingClientRect();
      let intersection = Math.abs(Math.floor(prevElemRect.left) - newX);
      if (intersection > 35 && this.total_blocks_stacked > 0) {
        let d = Math.floor(prevElemRect.left - newX) < 0 ? false : true; //

        this.current_block_element.style.animation = "none";
        this.current_block_element.style.animation = d
          ? "fall_block_left 2s ease-in-out forwards"
          : "fall_block_right 2s ease-in-out forwards";

        setTimeout(() => {
          this.pauseAllAudio();
          if (this.total_blocks_stacked > this.highest_score) {
            // this.game_over_bg.style.display = "flex";
            // this.high_score_box.style.display = "block";
            showGameOver("high_score", { prevHighScore: this.highest_score, newHighScore: this.total_blocks_stacked })
            postWebViewMessage({
              type: "updateHighScore",
              data: {
                username: this.username,
                newHighScore: this.total_blocks_stacked,
              },
            });
            highScoreAudio.play();
          } else {
            showGameOver("game_over", { maxScore: this.highest_score, yourScore: this.total_blocks_stacked, perfectBlocks: this.perfect_blocks_stacked });
            gameOverAudio.play();
          }
        }, 600);

        return false;
      }

      if (intersection <= 1) {
        let timout = setInterval(() => {
          this.reaction.classList.remove("reaction_show");
          clearTimeout(timout);
        }, 1000);
        this.reaction.classList.add("reaction_show");
        let div = document.createElement("div");
        let img = document.createElement("img");

        img.src = `./assets/perfect.GIF?timestamp=${Date.now()}`;
        img.alt = "Perfect";

        div.appendChild(img);
        div.style.top = `${newY + 35}px`;
        div.style.left = `${newX - 10}px`;
        div.style.zIndex = "100";
        div.style.position = "absolute";
        div.classList.add("perfect");

        this.building_container.append(div);
        addTenant(newX, newY, this.total_blocks_stacked + 1);
        prefectBlockAudio.play();
        this.perfect_blocks_stacked += 1
        let timeout = setTimeout(() => {
          this.building_container.removeChild(div);
        }, 1000);
      }
      blockAudio.play();

      if (this.total_blocks_stacked > 100) {
        generateAsteroid(this.asteroid_container_y);
        this.asteroid_container_y += 100;
        // delete all the clouds
        if (this.cloud_container.childNodes.length > 0) {
          Array.from(this.cloud_container.children).forEach((node) => {
            this.cloud_container.removeChild(node);
          });
        }
      } else if (this.total_blocks_stacked > 10) {
        // generateAsteroid(newY)
        generateClouds(newY);
      }
      return true;
    };

    let prevTenants = [];
    const addTenant = (newX, newY, total_blocks) => {
      if (prevTenants.length > 10) {
        for (let i = 0; i < 10; i++) {
          this.gameplay.removeChild(prevTenants[i]);
        }
        prevTenants.splice(0, 10);
      }
      const tenant1 = document.createElement("figure");
      tenant1.className = "tenant";
      tenant1.style.position = "absolute";
      tenant1.style.left = "-20%";
      tenant1.style.top = `${newY + (total_blocks - 4) * 90}px`;

      const img1 = document.createElement("img");
      img1.src = "./assets/reddit-character.PNG";
      img1.alt = "";
      tenant1.appendChild(img1);

      const tenant2 = document.createElement("figure");
      tenant2.className = "tenant";
      tenant2.style.position = "absolute";
      tenant2.style.left = "120%";
      tenant2.style.top = `${newY + (total_blocks - 4) * 90}px`;

      const img2 = document.createElement("img");
      img2.src = "./assets/reddit-character.PNG";
      img2.alt = "";
      tenant2.appendChild(img2);

      const tenant3 = document.createElement("figure");
      tenant3.className = "tenant";
      tenant3.style.position = "absolute";
      tenant3.style.left =
        Math.floor(Math.random() * 2) + 1 == 2 ? "120%" : "-20%";
      tenant3.style.top = `${
        newY + (total_blocks - 4) * 90 + Math.floor(Math.random() * 700) + 100
      }px`;

      const img3 = document.createElement("img");
      img3.src = "./assets/reddit-character.PNG";
      img3.alt = "";
      tenant3.appendChild(img3);

      // Append to the game area
      prevTenants.push(tenant1, tenant2, tenant3);
      this.gameplay.append(tenant1);
      this.gameplay.append(tenant2);
      this.gameplay.append(tenant3);

      setTimeout(() => {
        // const isTrue = this.total_blocks_stacked <= 4;
        const tenant1Height = `${
          newY + (total_blocks - (window.innerHeight < 600 ? 2 : 4) < 0 ? 0 : (total_blocks - (window.innerHeight < 600 ? 2 : 4)) * 90)
        }px`;
        const tenant2Height = `${
          newY + (total_blocks - (window.innerHeight < 600 ? 2 : 4) < 0 ? 0 : (total_blocks - (window.innerHeight < 600 ? 2 : 4)) * 90)
        }px`;
        const tenant3Height = `${
          newY + (total_blocks - (window.innerHeight < 600 ? 2 : 4) < 0 ? 0 : (total_blocks - (window.innerHeight < 600 ? 2 : 4)) * 90)
        }px`;

        tenant1.style.top = tenant1Height;
        tenant2.style.top = tenant2Height;
        tenant3.style.top = tenant3Height;

        tenant1.style.left = `${newX - 10}px`;
        tenant2.style.left = `${newX + 10}px`;
        tenant3.style.left = `${newX - 5}px`;
      }, 200);
    };

    let isLeft = true;

    // generate clouds in random cordinates
    const generateClouds = (newY) => {
      // only keep 100 cloud windows
      if (this.cloud_container.childNodes.length > 100) {
        for (let i = 0; i < 10; i++) {
          this.cloud_container.removeChild(this.cloud_container.firstChild);
        }
      }
      let newCloud = document.createElement("div");
      newCloud.classList.add("cloud");

      let halfWidth = window.innerWidth / 2;
      let leftPos = isLeft
        ? Math.random() * (halfWidth - 20) // Left half
        : halfWidth + Math.random() * (halfWidth - 20); // Right half

      // Cloud appears after newY + 200px, within a range of +400px
      let topPos = newY + 100 + Math.random() * 200;

      newCloud.style.left = `${leftPos}px`;
      newCloud.style.top = `-${Math.abs(topPos)}px`;
      let duration = `${Math.floor(Math.random() * 60) + 10}`;
      newCloud.style.animation = `cloud_ani ${duration}s ease-in-out infinite alternate`;

      newCloud.innerHTML = `
      <img src="./assets/cloud-${
        Math.floor(Math.random() * 3) + 1
      }.PNG" alt="cloud" />
  `;

      this.cloud_container.append(newCloud);
      isLeft = !isLeft;
    };

    // generate asteroid in random cordinates
    const generateAsteroid = (newY) => {
      //  only keep 100 cloud windows
      if (this.asteroid_container.childNodes.length > 100) {
        for (let i = 0; i < 10; i++) {
          this.asteroid_container.removeChild(
            this.asteroid_container.firstChild
          );
        }
      }
      let asteroid = document.createElement("div");
      asteroid.classList.add("asteroid");

      let halfWidth = window.innerWidth / 2;
      let leftPos = isLeft
        ? Math.random() * (halfWidth - 20) // Left half
        : halfWidth + Math.random() * (halfWidth - 20); // Right half

      // Cloud appears after newY + 200px, within a range of +400px
      let topPos = Math.abs(newY) + 100;

      asteroid.style.left = `${leftPos}px`;
      asteroid.style.top = `-${topPos}px`;
      let duration = `${Math.floor(Math.random() * 60) + 10}`;
      asteroid.style.animation = `asteroid_ani ${duration}s ease-in-out infinite alternate`;

      asteroid.innerHTML = `
      <img src="./assets/asteroids/asteroid-${
        Math.floor(Math.random() * 4) + 1
      }.PNG" alt="cloud" />
  `;

      this.asteroid_container.append(asteroid);
      isLeft = !isLeft;
    };

    // generate plant in sequencial order
    const handlePlant = (newY) => {
      if (planets.length > 0) return;
      let planet = document.createElement("div");
      planet.classList.add("planet");

      let halfWidth = window.innerWidth / 2;
      // let leftPos = isLeft
      //     ? Math.random() * (halfWidth - 20) // Left half
      //     : halfWidth + Math.random() * (halfWidth - 20); // Right half

      // Cloud appears after newY + 200px, within a range of +400px
      let topPos = Math.abs(newY) + 1000;

      // planet.style.left = `${leftPos}px`;
      planet.style.top = `-${Math.abs(topPos)}px`;
      // let duration = `${Math.floor(Math.random() * 60) + 10}`
      // planet.style.animation = `planet_ani 20s ease-in-out infinite alternate`

      planet.innerHTML = `
      <img src="./assets/planets/planet-${currPlanet}.PNG" alt="planet" />
  `;

      planets.push(planet);
      this.gameplay.append(planet);
      currPlanet++;
      // planetStarted = planetStartedBlock
    };

    this.thunderAnimation = () => {
      const element = document.querySelector(".lightening");

      if (element) {
        thunderAudio.play();
        element.classList.add("lighting-effect");

        setTimeout(() => {
          element.classList.remove("lighting-effect");
        }, 500);
      }
    };

    addEventListener("message", this.#onMessage);
    addEventListener("load", () => {
      postWebViewMessage({ type: "webViewReady" });
    });
  }

  /**
   * @arg {MessageEvent<DevvitSystemMessage>} ev
   * @return {void}
   */

  #onMessage = (ev) => {
    if (ev.data.type !== "devvit-message") return;
    const { message } = ev.data.data;

    let output = JSON.stringify(message, undefined, 2);
    switch (message.type) {
      case "initialData": {
        const { username, highestScore } = message.data;
        this.username = username;
        this.welcome_message.innerText = `Welcome ${this.username}!`;
        this.max_score.innerText = highestScore || 0;
        this.highest_score = highestScore || 0;
        this.loading_game = false;
        break;
      }
      case "leaderboard_data": {
        const data = message.data;
        this.leaderboard_data = data;
        this.leaderboard.innerHTML = data.map((user, idx) => {
          const medals = ["🥇", "🥈", "🥉"];
          return `
            <div class="leaderboard_box">
              <h4>${idx + 1}. ${user.username} ${medals[idx] || ""}</h4>
              <span>${user.highestScore}</span>
            </div>
          `;
        })
        .join("");
        break;
      }
      default:
        /** to-do: @satisifes {never} */
        const _ = message;
        break;
    }
  };
}

/**
 * Sends a message to the Devvit app.
 * @arg {WebViewMessage} msg
 * @return {void}
 */
function postWebViewMessage(msg) {
  window.parent.postMessage(msg, "*");
}

new App();
