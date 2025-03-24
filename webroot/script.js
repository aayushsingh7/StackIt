/** @typedef {import('../src/message.ts').DevvitSystemMessage} DevvitSystemMessage */
/** @typedef {import('../src/message.ts').WebViewMessage} WebViewMessage */


class App {
  constructor() {
    this.output = /** @type {HTMLPreElement} */ (document.querySelector('#messageOutput'));
    this.increaseButton = /** @type {HTMLButtonElement} */ (
      document.querySelector('#btn-increase')
    );
    this.decreaseButton = /** @type {HTMLButtonElement} */ (
      document.querySelector('#btn-decrease')
    );
    this.usernameLabel = /** @type {HTMLSpanElement} */ (document.querySelector('#username'));
    this.counterLabel = /** @type {HTMLSpanElement} */ (document.querySelector('#counter'));
    this.counter = 0;
    this.total_blocks_stacked = 0;


    this.intro = document.getElementById("intro");
    this.leaderboard = document.getElementById("leaderboard")
    this.gameplay = document.getElementById("gameplay")
    this.screen =document.getElementById("screen")
    this.button_container = document.getElementById("button_container")
    
    this.leaderboard_btn = document.getElementById("leaderboard-btn")
    this.play_btn = document.getElementById("play-btn")
    this.retry_btn = document.getElementById("retry-btn")
    this.exit_btn = document.getElementById("exit-btn")
    this.landing_box = document.getElementById("landing_box")
    this.gameplay_background = document.getElementById("gameplay_bg")
    this.controller = document.getElementById("controller"); // Assign controller to this.controller
    this.fall_distance = 550;
    this.building_container = document.getElementById("building")
    this.building_base = document.getElementById("base")
    this.score_card = document.getElementById("current_score")
    this.cloud_container = document.getElementById("cloud_container")
    this.game_over_bg = document.getElementById("game_over_bg")
    this.prev_block_location = {x:0,allowed:0}
    this.bg_position = 0;
    let current_block_element;

    this.play_btn.addEventListener("click",()=> {
       this.restartGame()
      })

    this.retry_btn.addEventListener("click", ()=> {
      this.restartGame()
    })

    this.restartGame = ()=> {
      this.intro.style.display = "none"
      this.gameplay.style.display = "flex"
      this.leaderboard.style.display = "none"
      this.screen.style.height = '100dvh'
      this.landing_box.style.maxWidth= "100%"
      this.landing_box.style.width = "100%"
      this.button_container.style.display = "none"
      this.total_blocks_stacked = 0;
      this.game_over_bg.style.display= "none"
      this.building_container.innerHTML = "";
      this.total_blocks_stacked = 0;
      this.counter = 0;
      this.score_card.innerText = 0;
      this.cloud_container.innerHTML = ""
      this.fall_distance = 550;
      this.bg_position = 0;
      this.building_container.style.top = "0%"
      this.gameplay_background.style.bottom = "0%"
      this.building_container.style.animation = "none"
      this.createNewBlock(0)
    }

    this.leaderboard_btn.addEventListener("click",()=> {
      this.intro.style.display = "none"
      this.gameplay.style.display = "none"
      this.leaderboard.style.display = "flex"
      postWebViewMessage({type:'leaderboard'})
    })

    this.exit_btn.addEventListener("click",()=> {
      this.screen.style.height = '400px'
      this.intro.style.display = "flex"
      this.gameplay.style.display = "none"
      this.leaderboard.style.display = "none"
      this.button_container.style.display = "block"
      this.landing_box.style.maxWidth= "600px"
      this.landing_box.style.width = "90%"
      this.game_over_bg.style.display= "none"
    })

    this.thread = document.getElementById("swing_thread");
    this.createNewBlock = (total_stacked)=> {
      let current_block_id = `${Math.floor(Math.random() * 100000000000000)}-${this.gameplay.childNodes.length}`
      const block = document.createElement("figure");
      block.classList.add("building_block");
      block.style.position = "absolute"; // Set absolute positioning
      // block.style.left = "50%";
      // block.style.top = "5%"
      block.style.transition = '0.2s ease-in-out'
      block.style.top =  "10px"
      block.style.left = "-37px"
      block.classList.add("new-block")
      block.id =  `${current_block_id}`

      const img = document.createElement("img");
     if(total_stacked == 0) {
      img.src = "./assets/flat-base.png";
     }else{
      img.src = "./assets/flat-block.png";
     }
      img.alt = "Building Block";
    
      block.appendChild(img);
      current_block_element = block;
      this.thread.appendChild(block); // Append without using innerHTML
    }



  const animateFall = (element,topPos,fallDistance, duration = 1) => {
    // Get the element's current position relative to the building_container
    const rect = element.getBoundingClientRect();
    const containerRect = this.building_container.getBoundingClientRect();
    const startX = rect.left - containerRect.left;
    const startY = topPos;

    // Get the current rotation angle
    const computedStyle = window.getComputedStyle(element);
    const transform = computedStyle.transform;

    let angle = 0;
    if (transform !== "none") {
      const matrix = new DOMMatrix(transform);
      angle = Math.atan2(matrix.b, matrix.a); // Extract rotation angle (radians)
    }

    // Compute new position after the fall
    const newX = Math.abs(startX + fallDistance * Math.sin(angle)); // Adjust X based on rotation
    const newY = startY + fallDistance * Math.cos(angle); // Adjust Y based on rotation
    // Apply the new position
    element.style.left = `${newX}px`;
    element.style.top = `${newY}px`;

    return { newX, newY };
  }

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
  
  
  let isOccupied = false;
  
  this.controller.addEventListener("click", () => {
    const rect = current_block_element.getBoundingClientRect();
    const computedStyle = window.getComputedStyle(this.thread);
    const transformValue = computedStyle.getPropertyValue("transform");
    const final_transform_value = getRotationAngle(transformValue);

    this.thread.removeChild(current_block_element);
    let cloneChild = current_block_element;
    let extra_pad = 0;

    if (final_transform_value < -20) {
      extra_pad = 60;
    } else if (final_transform_value > 20) {
      extra_pad = -30;
    }


    cloneChild.style.left = `${rect.left + extra_pad}px`;
    if(this.total_blocks_stacked >= 4){
      cloneChild.style.top = `-${(90 * (this.total_blocks_stacked - 3)) - 100}px`;
    }else{
      cloneChild.style.top = `${rect.top + 40 }px`;
    }
    cloneChild.style.transform = `rotate(${final_transform_value}deg)`;
    this.building_container.prepend(cloneChild);
    cloneChild.style.transform = "rotate(0deg)";

    // Ensure distance is clamped to a minimum of 0
    let distance = 550 - (this.total_blocks_stacked * 90);
    const { newX, newY } = animateFall(cloneChild, (rect.top+40), distance);

    setTimeout(() => {
      this.createNewBlock(this.total_blocks_stacked + 1);
    }, 200);

    // Ignore the initial check
    if (this.prev_block_location.x !== 0) {
      let validPlay = this.isValidPlay(
        newX,
        newY,
        this.prev_block_location.x,
        this.prev_block_location.allowed,
      );
      if (!validPlay) {
        // Game over
        // window.alert("Game over!");
        current_block_element.style.top = `${Math.abs(newY) + 1000}px`
        current_block_element.style.transition = "1s ease-in-out"
      } else {
        if (this.total_blocks_stacked >= 4) {
          this.gameplay_background.style.bottom = `-${this.bg_position + 10}%`;
          this.building_container.style.top = `${
            (this.total_blocks_stacked - 3) * 90
          }px`;
          Array.from(this.cloud_container.children).forEach((node) => {
            let getRect = node.getBoundingClientRect();
            let newTop = getRect.top + 90; // Move down instead of up
            node.style.top = `${newTop}px`;
        });

        if (this.total_blocks_stacked >= 10) {
          this.building_container.style.animation = `high-swing 4s ease-in-out infinite`;
      } else if (this.total_blocks_stacked >= 8) {
          this.building_container.style.animation = `high-swing 8s ease-in-out infinite`;
      } else if (this.total_blocks_stacked >= 6) {
          this.building_container.style.animation = `mid-swing 8s ease-in-out infinite`;
      } else if (this.total_blocks_stacked >= 4) {
          this.building_container.style.animation = `mid-swing 10s ease-in-out infinite`;
      } else if (this.total_blocks_stacked >= 2) {
          this.building_container.style.animation = `mid-swing 15s ease-in-out infinite`;
      }
      
        
          this.bg_position += 10;
        }
      }
    }

    this.total_blocks_stacked += 1;
    this.prev_block_location = { x: rect.left, allowed: rect.left + 70 };
    this.score_card.innerText = `${this.total_blocks_stacked}`
  });

  
  this.isValidPlay = (newX, newY, prevX, allowedDistance) => {
    let distance = Math.floor(Math.abs(newX - prevX));
    if (distance > 40 && this.total_blocks_stacked > 0) {
        setTimeout(()=> {
          this.game_over_bg.style.display= "flex"
        },200)
        return false;
    }
    if (distance == 0) {
        let div = document.createElement("div");
        let img = document.createElement("img");

        img.src = `./assets/perfect.gif?timestamp=${Date.now()}`;
        img.alt = "Perfect";
        
        div.appendChild(img);
        div.style.top = `${newY + 35}px`;
        div.style.left = `${newX - 10}px`;
        div.style.zIndex = "100";
        div.style.position = "absolute";
        div.classList.add("perfect");

        this.building_container.append(div);
        
       let timeout =  setTimeout(() => {
            this.building_container.removeChild(div);
        }, 600);
       
    }

    generateClouds(newY)
    generateClouds(newY)
    return true;
};

let isLeft = true; // Toggle value to alternate positions
const generateClouds = (newY) => {
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
  console.log(`-${topPos}`)

  newCloud.innerHTML = `
      <img src="./assets/cloud-${Math.floor(Math.random() * 3) + 1}.png" alt="cloud" />
  `;

  this.cloud_container.append(newCloud);
  isLeft = !isLeft;
};




    addEventListener('message', this.#onMessage);

    // This event gets called when the web view is loaded
    addEventListener('load', () => {
      postWebViewMessage({ type: 'webViewReady' });
    });

    this.increaseButton.addEventListener('click', () => {
      // Sends a message to the Devvit app
      postWebViewMessage({ type: 'setCounter', data: { newCounter: this.counter + 1 } });
    });

    this.decreaseButton.addEventListener('click', () => {
      // Sends a message to the Devvit app
      postWebViewMessage({ type: 'setCounter', data: { newCounter: this.counter - 1 } });
    });
  }

  /**
   * @arg {MessageEvent<DevvitSystemMessage>} ev
   * @return {void}
   */
  #onMessage = (ev) => {
    // Reserved type for messages sent via `context.ui.webView.postMessage`
    if (ev.data.type !== 'devvit-message') return;
    const { message } = ev.data.data;

    // Always output full message
    this.output.replaceChildren(JSON.stringify(message, undefined, 2));

    switch (message.type) {
      case 'initialData': {
        // Load initial data
        const { username, currentCounter } = message.data;
        this.usernameLabel.innerText = username;
        this.counter = currentCounter;
        this.counterLabel.innerText = `${this.counter}`;
        break;
      }
      case 'updateCounter': {
        const { currentCounter } = message.data;
        this.counter = currentCounter;
        this.counterLabel.innerText = `${this.counter}`;
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
  parent.postMessage(msg, '*');
}

new App();
