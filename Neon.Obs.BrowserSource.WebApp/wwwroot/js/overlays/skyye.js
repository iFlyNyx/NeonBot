const duration = 500;
const amplitude = 2;
let start = null;

const customUsers = window.__customUsers || [];
const ignoreBotUsers = window.__ignoreBotUsers || [];
let ignoreCommandMessages = window.__ignoreCommandMessages || false;

const image1 = new Image();
image1.src = '/images/skyye/cthulhulel/cthulhulel_wing.png';

const image2 = new Image();
image2.src = '/images/skyye/cthulhulel/cthulhulel_wing.png';

let chatCounter = document.querySelectorAll('.neon-message').length + 1;
let maxMessages = 20;

window.Overlay.onInit = () => {
    console.log('Overlay type "skyye" initialized');
};

window.Overlay.onMessageReceived = (msg) => {
    try {
        handleMessage(msg);
    }
    catch (error) {
        console.error('Error handling message:', error);
    }
};

window.Overlay.onEventReceived = (msg) => {
    try {
        handleEvent(msg);
    }
    catch (error) {
        console.error('Error handling event:', error);
    }
};

window.Overlay.onStreamElementsEventReceived = (msg) => {
    try {
        handleStreamElementsEvent(msg);
    }
    catch (error) {
        console.error('Error handling StreamElements event:', error);
    }
};

function handleMessage(msg) {
    let username = msg.chatterName;
    let style = getChatterStyle(msg.chatterFlags, username);
    let message = msg.message;
    let messageId = msg.messageId;
    
    if (ignoreBotUsers.includes(username.toLowerCase())) {
        return;
    }
    
    if (ignoreCommandMessages && message.startsWith('!')) {
        return;
    }
    
    let newMsg = buildNewChatMessage(username, style, message, msg.chatterFlags);
    let newMsgId = `chat-message-${chatCounter}`;
    newMsg.id = newMsgId;
    newMsg.setAttribute('message-id', messageId);
    newMsg.setAttribute('username', username);
    
    const chatContainer = document.querySelector('#chat-container');
    chatContainer.appendChild(newMsg);
    
    document.getElementById(newMsgId).scrollIntoView({ behavior: 'smooth' });
    chatCounter++;

    clearOldMessages();
}

function handleEvent(msg) {
    let eventType = msg.eventType;
    
    if (eventType === "message-delete" || eventType === "timeout") {
        handleMessageDelete(msg);
        document.getElementById(`chat-message-${chatCounter}`).scrollIntoView({ behavior: 'smooth' });
        return;
    }
    
    let message = msg.eventMessage;
    let messageStyle = msg.eventLevel;
    
    let newMsg = buildNewEventMessage(message, messageStyle);
    let newMsgId = `chat-message-${chatCounter}`;
    newMsg.id = newMsgId;
    
    const chatContainer = document.querySelector('#chat-container');
    chatContainer.appendChild(newMsg);

    document.getElementById(newMsgId).scrollIntoView({ behavior: 'smooth' });
    chatCounter++;

    clearOldMessages();
}

function handleMessageDelete(msg) {
    let eventType = msg.eventType;
    
    if (eventType === "message-delete") {
        let targetDiv = document.querySelector(`div[message-id='${msg.messageId}']`);
        if (!targetDiv) return;
        
        targetDiv.classList.add('d-none');
    }
    
    if (eventType === "timeout") {
        let targetDivs = document.querySelectorAll(`div[username='${msg.chatterName}']`);
        if (!targetDivs || targetDivs.length === 0) return;
        
        targetDivs.forEach((div) => {
            div.classList.add('d-none');
        });
    }
}

function handleStreamElementsEvent(msg) {
    let message = msg.eventMessage;
    let messageStyle = msg.eventLevel;

    let newMsg = buildNewEventMessage(message, messageStyle);
    let newMsgId = `chat-message-${chatCounter}`;
    newMsg.id = newMsgId;

    const chatContainer = document.querySelector('#chat-container');
    chatContainer.appendChild(newMsg);

    document.getElementById(newMsgId).scrollIntoView({ behavior: 'smooth' });
    chatCounter++;

    clearOldMessages();
}

function clearOldMessages() {
    const chatContainer = document.querySelector('#chat-container');
    const oldestMessage = chatContainer.firstElementChild;
    
    if (document.hidden && oldestMessage) {
        oldestMessage.remove();
        return;
    }
    
    if (oldestMessage) {
        oldestMessage.classList.add('fade-out');
    }
    
    oldestMessage.addEventListener('transitionend', () => {
        oldestMessage.remove();
    }, { once: true });
}

function getChatterStyle(chatterFlags, username) {    
    if (customUsers.includes(username.toLowerCase())) {
        return username.toLowerCase();
    }
    
    if (chatterFlags.isBroadcaster) return 'broadcaster';
    if (chatterFlags.isModerator) return 'mod';
    if (chatterFlags.isVip) return 'vip';
    if (chatterFlags.isSubscriber) return 'sub';
    return 'normal';
}

function buildNewChatMessage(username, style, message, chatterFlags) {
    let chatMessage = document.createElement('div')
    chatMessage.classList.add('chat-message');
    let chatMessageSpan = document.createElement('span')
    chatMessageSpan.innerHTML = message;
    chatMessage.appendChild(chatMessageSpan);

    let chatBoxInner = document.createElement('div')
    chatBoxInner.classList.add('chatbox-inner');
    chatBoxInner.appendChild(chatMessage);

    let chatBoxOuter = document.createElement('div')
    chatBoxOuter.classList.add('chatbox-outer');
    chatBoxOuter.appendChild(chatBoxInner);

    let neonUserBox = document.createElement('div')
    neonUserBox.classList.add('user-box');
    let neonUserBoxInner = document.createElement('div')
    neonUserBoxInner.classList.add('user-box-inner');
    
    let neonUsername = document.createElement('span')
    neonUsername.textContent = username;
    neonUserBoxInner.appendChild(neonUsername);
    
    let chatterImageBonus = (style === 'vip' || (customUsers.includes(username.toLowerCase()) && chatterFlags.isVip)) ? document.createElement('div') : undefined;
    if (chatterImageBonus) {
        chatterImageBonus.classList.add('chatter-vip-badge');
        neonUserBoxInner.appendChild(chatterImageBonus);
    }
    
    neonUserBox.appendChild(neonUserBoxInner);
    addCustomUserBoxTags(username, neonUserBox);

    let chatterImage = document.createElement('div')
    chatterImage.classList.add(`chatter-${style}`);

    if (style === 'vip' || style === 'mod' || style === 'sub' || (customUsers.includes(username.toLowerCase()) && !chatterFlags.isBroadcaster)) {
        chatterImage.classList.add('animated');
    }

    let subRazzle = style === 'sub' ? document.createElement('div') : undefined;
    if (subRazzle) {
        subRazzle.classList.add('chatter-sub-razzle-dazzle');
        subRazzle.classList.add('animated');
    }

    let neonMessage = document.createElement('div')
    neonMessage.classList.add('neon-message');
    neonMessage.appendChild(chatterImage);
    addCustomUserTags(username, neonMessage);

    if (subRazzle) {
        neonMessage.appendChild(subRazzle);
    }
    neonMessage.appendChild(neonUserBox);
    neonMessage.appendChild(chatBoxOuter);
    
    return neonMessage;
}

function addCustomUserBoxTags(username, element) {
    if (username.toLowerCase() === 'cthulhulel') {
        let customTagPrepend1 = document.createElement('div');
        customTagPrepend1.classList.add('chatter-cthulhulel-tent');
        customTagPrepend1.classList.add('flipped');
        element.appendChild(customTagPrepend1);
        
        let customTagPrepend2 = document.createElement('div');
        customTagPrepend2.classList.add('chatter-cthulhulel-tent');
        element.appendChild(customTagPrepend2);
        
        return;
    }
}

function addCustomUserTags(username, element) {
    if (username.toLowerCase() === 'iflynyx') {
        let customTagPrepend = document.createElement('div');
        customTagPrepend.classList.add('chatter-iflynyx-laptop');
        element.prepend(customTagPrepend);
        
        let customTagAppend = document.createElement('div');
        customTagAppend.classList.add('chatter-iflynyx-coffee');
        element.appendChild(customTagAppend);
        
        return;
    }
    
    if (username.toLowerCase() === 'cthulhulel') {
        let customTagAppend1 = document.createElement('canvas');
        customTagAppend1.classList.add('animated-wing');
        element.appendChild(customTagAppend1);
        
        let customTagAppend2 = document.createElement('canvas');
        customTagAppend2.classList.add('animated-wing');
        customTagAppend2.classList.add('flipped');
        element.appendChild(customTagAppend2);
        
        return;
    }
    
    if (username.toLowerCase() === 'skyyexvii') {
        let customTagPrepend = document.createElement('div');
        customTagPrepend.classList.add('chatter-skyyexvii-hair');
        element.prepend(customTagPrepend);
        
        let customTagAppend = document.createElement('div');
        customTagAppend.classList.add('chatter-skyyexvii-hand');
        element.append(customTagAppend);
        
        return;
    }
    
    if (username.toLowerCase() === 'neliossar3') {
        let customTagAppend = document.createElement('div');
        customTagAppend.classList.add('chatter-neliossar3-totem');
        element.append(customTagAppend);
        
        return;
    }
}

function buildNewEventMessage(message, type) {
    let eventInner = document.createElement('div')
    eventInner.classList.add('eventbox-inner');

    let eventInnerSpan = document.createElement('span')
    eventInnerSpan.textContent = message;
    eventInner.appendChild(eventInnerSpan);

    let eventBoxOuter = document.createElement('div')
    eventBoxOuter.classList.add('eventbox-outer');

    switch (type) {
        case 'small': {
            let eventImageTopSmall = document.createElement('div');
            eventImageTopSmall.classList.add('event-image-top-small');
            eventBoxOuter.appendChild(eventImageTopSmall);
            break;
        }
        case 'medium': {
            let eventImageTopMedium = document.createElement('div');
            eventImageTopMedium.classList.add('event-image-top-medium');
            eventBoxOuter.appendChild(eventImageTopMedium);

            let eventImageTopMediumRazzleDazzle = document.createElement('div');
            eventImageTopMediumRazzleDazzle.classList.add('event-image-top-medium-razzle-dazzle');
            eventBoxOuter.appendChild(eventImageTopMediumRazzleDazzle);

            let eventImageTopMediumGlow = document.createElement('div');
            eventImageTopMediumGlow.classList.add('event-image-top-medium-glow');
            eventBoxOuter.appendChild(eventImageTopMediumGlow);
            break;
        }
        case 'large': {
            let eventImageTopLarge = document.createElement('div');
            eventImageTopLarge.classList.add('event-image-top-large');
            eventBoxOuter.appendChild(eventImageTopLarge);
            break;
        }
    }

    let eventImageBottomLeft = document.createElement('div');
    eventImageBottomLeft.classList.add('event-image-bottom-left');
    let eventImageBottomRight = document.createElement('div');
    eventImageBottomRight.classList.add('event-image-bottom-right');

    eventBoxOuter.appendChild(eventImageBottomLeft);
    eventBoxOuter.appendChild(eventImageBottomRight);
    eventBoxOuter.appendChild(eventInner);

    let eventMessage = document.createElement('div');
    eventMessage.classList.add('event-message');
    eventMessage.appendChild(eventBoxOuter);

    let neonMessage = document.createElement('div')
    neonMessage.classList.add('neon-message');
    neonMessage.appendChild(eventMessage);

    return neonMessage;
}

function runAnimationWings(timestamp) {
    if (!start) start = timestamp;
    const elapsed = (timestamp - start) % duration;
    const progress = elapsed / duration;
    const offset = Math.sin(progress * 2 * Math.PI) * amplitude;

    wing1Animation(offset);
    wing2Animation(offset);

    requestAnimationFrame(runAnimationWings);
}

function wing1Animation(offset) {
    const canvases = document.querySelectorAll('.animated-wing');
    if (!canvases.length) return;

    const imageTargetSize = 100;
    const pivotX = 30;
    const pivotY = imageTargetSize;

    canvases.forEach(canvas => {
        const ctx = canvas.getContext('2d');
        canvas.width = imageTargetSize;
        canvas.height = imageTargetSize;
    
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.translate(15, pivotY);
    
        ctx.rotate(offset / 5);
        ctx.drawImage(image1, -pivotX, -pivotY, canvas.width, canvas.height);
        ctx.restore();
    });
}

function wing2Animation(offset) {
    const canvases = document.querySelectorAll('.animated-wing.flipped');
    if (!canvases.length) return;

    const imageTargetSize = 100;
    const pivotX = 30;
    const pivotY = imageTargetSize;

    canvases.forEach(canvas => {
        const ctx = canvas.getContext('2d');
        canvas.width = imageTargetSize;
        canvas.height = imageTargetSize;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();

        ctx.clearRect(0, 0, imageTargetSize, imageTargetSize);
        ctx.save();
        ctx.translate(pivotX, pivotY);
        ctx.translate((pivotX * 2) - 5, 0);

        ctx.scale(-1, 1);
        ctx.rotate(offset / 5);
        ctx.drawImage(image1, -pivotX, -pivotY, canvas.width, canvas.height);
        ctx.restore(); 
    });
}

function runAnimation(timestamp) {
    if (!start) start = timestamp;
    const elapsed = (timestamp - start) % duration;
    const progress = elapsed / duration;
    const offset = Math.sin(progress * 2 * Math.PI) * amplitude;

    const eventMessages = document.querySelectorAll('.animated');
    eventMessages.forEach((message) => {
        message.style.transform = `translateY(${offset}px)`;
    });

    requestAnimationFrame(runAnimation);
}


requestAnimationFrame(runAnimation);
requestAnimationFrame(runAnimationWings);
