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
    this.rain_section = document.getElementById("rain_sec")
    this.moon = document.getElementById("moon")
    this.reaction = document.getElementById("reaction")
    this.thread = document.getElementById("swing_thread");
    this.prev_element = null
    this.bg_position = 0;
    this.current_block_element;


    // audios
    let blockAudio = new Audio("./assets/block-2.mp3")
    let prefectBlockAudio = new Audio("./assets/perfect.mp3")
    let rainAudio = new Audio("./assets/rain-sound.mp3")
    let thunderAudio = new Audio("./assets/thunder.mp3")

    // buttons function
    this.play_btn.addEventListener("click",()=> {
       this.restartGame()
    })

    this.retry_btn.addEventListener("click", ()=> {
      this.restartGame()
    })

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
      this.total_blocks_stacked = 0;
      this.counter = 0;
      this.score_card.innerText = 0;
      this.building_container.innerHTML = "";
      this.cloud_container.innerHTML = "";
      this.fall_distance = 550;
      this.bg_position = 0;
      this.building_container.style.top = "0%"
      this.gameplay_background.style.bottom = "0%"
      this.building_container.style.animation = "none"
      this.createNewBlock(0)
      // this.triggerAnimation();
      this.prev_element = null
      this.moon.style.display="none"
    }

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
      this.current_block_element = block;
      this.thread.appendChild(block); // Append without using innerHTML
    }

    let maxSwing = 0; 
    let duration = 5;

const animateBuildings = (buildings)=> {
  if(this.total_blocks_stacked <4) return;
    buildings.forEach((building, index) => {
        // If the building already has an animation, continue from where it is
        if (building.style.animation) return;
        
        maxSwing = Math.min(maxSwing, 40)
        duration = Math.max(duration, 1)
        console.log(maxSwing)
        let buildingRect = building.getBoundingClientRect()
        // Get the current position using .offsetLeft
        let startPosition = Math.floor(building.left);
 
        // Update lastEndPosition so the next building continues from here
        // lastEndPosition = startPosition;

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
          if(building.style.animation) return;
          building.style.animation = `swing_${index} ease-in-out ${duration}s infinite alternate`;
        }, 200);
      });
      maxSwing += 0.2
      duration -= 0.05
}

// Example: Function to handle dynamically added elements
function updateBuildings() {
    let cloneChildren = document.querySelectorAll(".block_added");
    animateBuildings(cloneChildren);
}


  const animateFall = (element, topPos, fallDistance, prevElement) => {
    const rect = element.getBoundingClientRect();
    const prevElementRect = this.prev_element?.getBoundingClientRect();
    const containerRect = this.building_container.getBoundingClientRect();
    const startX = Math.floor(rect.left) ;
    const startY = topPos;

    // // console.log("PREVIOUS ELEMENT TOP", prevElementRect?.top)

    const computedStyle = window.getComputedStyle(element);
    const transform = computedStyle.transform;
    
    let angle = 0;
    if (transform !== "none") {
        const matrix = new DOMMatrix(transform);
        angle = Math.atan2(matrix.b, matrix.a);
    }
  
    const newX = Math.floor(Math.abs(startX + fallDistance * Math.sin(angle)));
    // const newY = Math.floor(startY + fallDistance * Math.cos(angle));
    let newY = 0;

    if(prevElement) {
      if(this.total_blocks_stacked >= 4){
        newY =  Math.round(prevElementRect.top) - ((this.total_blocks_stacked - 3) * 90)
      }else{
        newY =  Math.round(prevElementRect?.top) - 90
      }
    }else{
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
      extra_pad_top =40;
    }


    cloneChild.style.left = `${Math.floor(rect.left) + extra_pad}px`;
    // block falling position
    if(this.total_blocks_stacked >= 4){
      cloneChild.style.top = `-${(90 * (this.total_blocks_stacked - 3)) - 100}px`;
    }else{
      cloneChild.style.top = `${Math.floor(rect.top) + 42 + extra_pad_top }px`;
    }
    cloneChild.style.transform = `rotate(${final_transform_value}deg)`;
    cloneChild.classList.add("block_added")
    this.building_container.prepend(cloneChild);
    this.thread.innerHTML = ""
    extra_pad_top = 0;
    cloneChild.style.transform = "rotate(0deg)";
    // let cloneChildrens = document.querySelectorAll(".building_block")
    updateBuildings()
    // Ensure distance is clamped to a minimum of 0
    let distance = 550 - (this.total_blocks_stacked * 90);
    const { newX, newY } = animateFall(cloneChild, (Math.floor(rect.top)+42), distance, this.prev_element);
   // console.log({newBlockLeft:newX})
    setTimeout(() => {
      this.createNewBlock(this.total_blocks_stacked + 1);
    },400);

    // Ignore the initial check
    if (this.prev_element) {
      let validPlay = this.isValidPlay(
        newX,
        newY,
        this.prev_element,
        // this.prev_block_location.x,
        // this.prev_block_location.allowed,
      );
      if (!validPlay) {
        // Game over
        // window.alert("Game over!");
        // this.current_block_element.style.top = `${Math.abs(newY) + 1000}px`
        // this.current_block_element.style.transition = "1s ease-in-out"
      } else {
        if (this.total_blocks_stacked >= 4) {


          this.gameplay_background.style.bottom = `-${this.bg_position + 10}%`;
          this.building_container.style.top = `${
            (this.total_blocks_stacked - 3) * 90
          }px`;
          Array.from(this.cloud_container.children).forEach((node) => {
            let getRect = node.getBoundingClientRect();
            let newTop = Math.floor(getRect.top) + 90; // Move down instead of up
            node.style.top = `${newTop}px`;
        });

        if(this.total_blocks_stacked >= 10 && this.total_blocks_stacked < 20){
          this.screen.style.background = "#003e3c";
          rainAudio.loop = true;
          rainAudio.play()
          this.rain_section.style.display = "block";
          this.rain_section.style.opacity = "1"
          this.triggerAnimation()
        }else if(this.total_blocks_stacked >= 20 && this.total_blocks_stacked < 40){
          this.rain_section.style.opacity = "0";
        
          setTimeout(()=> {
         this.rain_section.style.display = "none"
          },200)
          this.screen.style.background = "#001514";
          this.cloud_container.childNodes.forEach((node)=> {
             node.style.filter = "contrast(0.1)";
          })
          this.moon.style.display = "block"
          this.moon.style.opacity = "1"
        }else{
          this.rain_section.style.opacity = "0";
          setTimeout(()=> {
         this.rain_section.style.display = "none"
          },200)
        }
      
      //   } else if (this.total_blocks_stacked >= 10) {
      //     this.building_container.style.animation = `high-swing 4s ease-in-out infinite`;
      // } else if (this.total_blocks_stacked >= 8) {
      //     this.building_container.style.animation = `high-swing 8s ease-in-out infinite`;
      // } else if (this.total_blocks_stacked >= 6) {
      //     this.building_container.style.animation = `mid-swing 8s ease-in-out infinite`;
      // } else if (this.total_blocks_stacked >= 4) {
      //     this.building_container.style.animation = `mid-swing 10s ease-in-out infinite`;
      // } else if (this.total_blocks_stacked >= 2) {
      //     this.building_container.style.animation = `mid-swing 15s ease-in-out infinite`;
      // }
      
        
          this.bg_position += 10;
        }

//         const animation = this.building_container.getAnimations().find(anim => anim.animationName == "mid-swing");
//    // console.log(animation)
// if (animation) {  
  

//     if (this.total_blocks_stacked >= 6) {
//         animation.updatePlaybackRate(4); // Increase speed
//         // console.log("change animation spee",animation.playbackRate)
//     } else if (this.total_blocks_stacked >= 4) {
//         animation.updatePlaybackRate(2);
//         // console.log("change animation spee",animation.playbackRate)
//     } else if (this.total_blocks_stacked >= 2) {
//         animation.playbackRate = 1;
//         // console.log("change animation spee",animation.playbackRate)
//     }
// } else {
//     // Start the animation if it hasn't already started
//     this.building_container.style.animation = `mid-swing 4s infinite ease-in-out`;
// }

        // if(this.total_blocks_stacked >= 6) {
        //   this.building_container.style.animationDuration = "1s"
        // }else if(this.total_blocks_stacked >= 4){
        //   this.building_container.style.animationDuration = "2s"
        // }else if(this.total_blocks_stacked >= 2) {
        //   this.building_container.style.animation = `mid-swing infinite ease-in-out`; 
        //   this.building_container.style.animationDuration = "4s"
        // }

      }
    }else{
      blockAudio.play()
    }

    // this.building_container.style.top = `${newY}px`
    this.total_blocks_stacked += 1;
    // // console.log("THIS IS THE CLONE CHILD",cloneChild)
   this.prev_element = cloneChild;
    this.score_card.innerText = `${this.total_blocks_stacked}`
    let prevElementRect = this.prev_element?.getBoundingClientRect();
    // console.log({prevLeft:Math.floor(prevElementRect.left)})
    prevX = prevElementRect.left
  });

  const moveElements = ()=> {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        let buildRect = this.building_container.getBoundingClientRect();
        
        if ((buildRect.top - 90) < 0) {
          clearInterval(interval);
          resolve(); // Resolve the Promise once the condition is met
          return;
        }
  
        Array.from(this.cloud_container.children).forEach((node) => {
          let getRect = node.getBoundingClientRect();
          let newTop = Math.floor(getRect.top) - 90; // Move down instead of up
          node.style.top = `${newTop}px`;
        });
  
        this.gameplay_background.style.bottom = `${this.bg_position < 0 ? "" : "-"}${this.bg_position - 10}%`;
        this.building_container.style.top = `${Math.floor(buildRect.top) - 90}px`;
        this.bg_position -= 10;
      }, 400);
    });
  }
  
 
  

  this.isValidPlay = async(newX, newY, prevElement, allowedDistance) => {
   let prevElemRect = this.prev_element.getBoundingClientRect();
  let intersection = Math.abs(Math.floor(prevElemRect.left) - newX);
  if(intersection > 35 && this.total_blocks_stacked > 0){
    

    const buildings = document.querySelectorAll(".building_block")
let d = true; // Assuming you want to alternate animations
let delay = 0;

buildings.forEach((node, index) => {
  console.log(index)
  
  // Clear existing animation first
  node.style.animation = 'none';
  
  // Assign new animation
  node.style.animation = d 
    ? "fall_block_left 2s ease-in-out forwards" 
    : "fall_block_right 2s ease-in-out forwards";
  
  // Use template literal correctly for delay
  node.style.animationDelay = `${delay}s`;
  
  // Toggle direction and increment delay
  d = !d;
  delay += 0.4;
})

  // Usage
  moveElements().then(() => {
    this.game_over_bg.style.display = "flex"
  });
  return false;
  }


    if (intersection <= 1) {
      let timout= setInterval(()=> {
        this.reaction.classList.remove("reaction_show")
        clearTimeout(timout)
      }, 1000)
      this.reaction.classList.add("reaction_show")
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
        addTenant(newX,newY,this.total_blocks_stacked+1)
        prefectBlockAudio.play()
       let timeout =  setTimeout(() => {
            this.building_container.removeChild(div);
        }, 1000);
      }
      // }else{
        blockAudio.play();

      // }
      
    generateClouds(newY)
    generateClouds(newY)
    return true;
};


const addTenant = (newX, newY, total_blocks) => {
  const tenant1 = document.createElement("figure");
  tenant1.className = "tenant";
  tenant1.style.position = "absolute";
  tenant1.style.left = "-20%";
  tenant1.style.top = `${newY + ((total_blocks - 4) * 90)}px`;

  const img1 = document.createElement("img");
  img1.src = "./assets/reddit-character.png";
  img1.alt = "";
  tenant1.appendChild(img1);

  const tenant2 = document.createElement("figure");
  tenant2.className = "tenant";
  tenant2.style.position = "absolute";
  tenant2.style.left = "120%";
  tenant2.style.top = `${newY + ((total_blocks - 4) * 90)}px`;

  const img2 = document.createElement("img");
  img2.src = "./assets/reddit-character.png";
  img2.alt = "";
  tenant2.appendChild(img2);

  const tenant3 = document.createElement("figure");
  tenant3.className = "tenant";
  tenant3.style.position = "absolute";
  tenant3.style.left = (Math.floor(Math.random() * 2) + 1) == 2 ? "120%" : "-20%" ;
  tenant3.style.top = `${newY + ((total_blocks - 4) * 90) + Math.floor(Math.random() * 700) + 100}px`;

  const img3 = document.createElement("img");
  img3.src = "./assets/reddit-character.png";
  img3.alt = "";
  tenant3.appendChild(img3);

  // Append to the game area
  this.gameplay.append(tenant1);
  this.gameplay.append(tenant2);
  this.gameplay.append(tenant3)

  setTimeout(() => {
    // const isTrue = this.total_blocks_stacked <= 4;
    const tenant1Height = `${newY + ((total_blocks - 4) < 0 ? 0 : (total_blocks -4) * 90)}px`;
    const tenant2Height = `${newY + ((total_blocks - 4) < 0 ? 0 : (total_blocks -4) * 90)}px`;
    const tenant3Height = `${newY + ((total_blocks - 4) < 0 ? 0 : (total_blocks -4) * 90)}px`;
 
    tenant1.style.top = tenant1Height;
    tenant2.style.top = tenant2Height;
    tenant3.style.top = tenant3Height;
    

    // console.log({tenant1Height, tenant2Height, totalStacked:this.total_blocks_stacked, newY, condition:newY < 0 ? "-" : "+"})

    tenant1.style.left = `${newX - 10}px`;
    tenant2.style.left = `${newX + 10}px`;
    tenant3.style.left = `${newX - 5}px`

  }, 200);
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
  let duration = `${Math.floor(Math.random() * 60) + 10}`
  newCloud.style.animation = `cloud_ani ${duration}s ease-in-out infinite alternate`

  newCloud.innerHTML = `
      <img src="./assets/cloud-${Math.floor(Math.random() * 3) + 1}.png" alt="cloud" />
  `;

  this.cloud_container.append(newCloud);
  isLeft = !isLeft;
};


this.triggerAnimation = ()=> {
  const element = document.querySelector(".lightening"); 
  
  if (element) {
    thunderAudio.play();
    element.classList.add("lighting-effect");

    setTimeout(() => {
      element.classList.remove("lighting-effect");
    }, 500); 
  }
  // setTimeout(this.triggerAnimation, Math.random() * 20000 + 4000);
}



    addEventListener('message', this.#onMessage);

    // This event gets called when the web view is loaded
    addEventListener('load', () => {
      // const audio = new Audio("./assets/game-background-music-default.mp3");
      // audio.play();
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


