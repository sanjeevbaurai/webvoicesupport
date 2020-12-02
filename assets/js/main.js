function initialLoad() {
  //console.log("Loaded Page")

}
$(document).ready(function () {
  initialLoad();
  /* for Playback  --Start*/
  var counter = 0;
  var userChatName = 'User'
  var chatBotName = 'BOT@BT '
  var sorryText = "Sorry I didn't get you !!!"
  var helpContent;
  var synth = window.speechSynthesis;
  var firstScreen = document.querySelector('#firstScreen');
  var secondScreen = document.querySelector('#secondScreen');
  var helptext = document.querySelector('#helptext');

  var touchToStart = document.querySelector('.touch-toStart');
  var playBackTxt = document.querySelector('#playBackTxt');
  var voiceSelect = document.querySelector('#voiceSelect');

  var pitch = document.querySelector('#pitch');
  var pitchValue = document.querySelector('#pitch-value');
  var rate = document.querySelector('#rate');
  var rateValue = document.querySelector('#rate-value');

  var voiceTestBtn = document.querySelector('#voiceTestBtn');
  var voiceTestInput = document.querySelector('#voiceTestInput');

  var voiceRecordBtn = document.querySelector('#voiceRecordBtn'); //To change to correct Id
  var startChatBtn = document.querySelector('#startChatBtn');

  var chatArea = document.querySelector('#chatArea');

  var phrasePara = document.querySelector('#phrase');
  var resultPara = document.querySelector('#result');
  var diagnosticPara = document.querySelector('#diagnosticPara');


  var voices = [];

  /* for Playback  --End*/

  var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
  var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
  var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;


  function randomPhrase() {
    var number = Math.floor(Math.random() * phrases.length);
    return number;
  }

  touchToStart.addEventListener('click', openSrceenTwo);
  
    function openSrceenTwo() {
      setTimeout(() => {
        $(firstScreen).addClass('hide');
        $(secondScreen).removeClass('hide');
      }, 1000);
  
    }
  function speechRecorder() {
    voiceRecordBtn.disabled = true;
    $(voiceRecordBtn).addClass('selectedImg').removeClass('defaultImg');
    // voiceRecordBtn.textContent = 'Recording';

    // var phrase = phrases[randomPhrase()];
    // To ensure case consistency while checking with the returned output text
    // phrase = phrase.toLowerCase();
    // phrasePara.textContent = phrase;
    // resultPara.textContent = 'Right or wrong?';
    // resultPara.style.background = 'rgba(0,0,0,0.2)';
    diagnosticPara.textContent = '...diagnostic messages';

    var grammar = '#JSGF V1.0; grammar phrase; public <phrase> = ' + phrase + ';';
    var recognition = new SpeechRecognition();
    var speechRecognitionList = new SpeechGrammarList();
    speechRecognitionList.addFromString(grammar, 1);
    recognition.grammars = speechRecognitionList;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();

    recognition.onresult = function (event) {
      // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
      // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
      // It has a getter so it can be accessed like an array
      // The first [0] returns the SpeechRecognitionResult at position 0.
      // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
      // These also have getters so they can be accessed like arrays.
      // The second [0] returns the SpeechRecognitionAlternative at position 0.
      // We then return the transcript property of the SpeechRecognitionAlternative object 
      var speechResult = event.results[0][0].transcript.toLowerCase();
      diagnosticPara.textContent = 'Speech received: ' + speechResult + '.';
      addChatToChatArea(false, speechResult);


      /*
if(speechResult === phrase) {
resultPara.textContent = 'I heard the correct phrase!';
resultPara.style.background = 'lime';
} else {
resultPara.textContent = 'That didn\'t sound right.';
resultPara.style.background = 'red';
}
*/
      findResponse(speechResult)
      //console.log('Confidence: ' + event.results[0][0].confidence);
    }

    recognition.onspeechend = function () {
      recognition.stop();
      voiceRecordBtn.disabled = false;
      $(voiceRecordBtn).addClass('defaultImg').removeClass('selectedImg');
      //voiceRecordBtn.textContent = 'Ask Me';
    }

    recognition.onerror = function (event) {
      voiceRecordBtn.disabled = false;
      $(voiceRecordBtn).addClass('defaultImg').removeClass('selectedImg');
      //voiceRecordBtn.textContent = 'Ask Me';
      diagnosticPara.textContent = 'Error occurred in recognition: ' + event.error;
      addChatToChatArea(true, sorryText)
    }

    recognition.onaudiostart = function (event) {
      //Fired when the user agent has started to capture audio.
      //console.log('SpeechRecognition.onaudiostart');
    }

    recognition.onaudioend = function (event) {
      //Fired when the user agent has finished capturing audio.
      //console.log('SpeechRecognition.onaudioend');
    }

    recognition.onend = function (event) {
      //Fired when the speech recognition service has disconnected.
      //console.log('SpeechRecognition.onend');
    }

    recognition.onnomatch = function (event) {
      //Fired when the speech recognition service returns a final result with no significant recognition. This may involve some degree of recognition, which doesn't meet or exceed the confidence threshold.
      //console.log('SpeechRecognition.onnomatch');
    }

    recognition.onsoundstart = function (event) {
      //Fired when any sound — recognisable speech or not — has been detected.
      //console.log('SpeechRecognition.onsoundstart');
    }

    recognition.onsoundend = function (event) {
      //Fired when any sound — recognisable speech or not — has stopped being detected.
      //console.log('SpeechRecognition.onsoundend');
    }

    recognition.onspeechstart = function (event) {
      //Fired when sound that is recognised by the speech recognition service as speech has been detected.
      //console.log('SpeechRecognition.onspeechstart');
    }
    recognition.onstart = function (event) {
      //Fired when the speech recognition service has begun listening to incoming audio with intent to recognize grammars associated with the current SpeechRecognition.
      //console.log('SpeechRecognition.onstart');
    }
  }
  //speechRecorder
  voiceRecordBtn.addEventListener('click', speechRecorder);

  function populateVoiceList() {
    voices = synth.getVoices().sort(function (a, b) {
      const aname = a.name.toUpperCase(),
        bname = b.name.toUpperCase();
      if (aname < bname) return -1;
      else if (aname == bname) return 0;
      else return +1;
    });
    var selectedIndex = voiceSelect.selectedIndex < 0 ? 0 : voiceSelect.selectedIndex;
    voiceSelect.innerHTML = '';
    for (i = 0; i < voices.length; i++) {
      var option = document.createElement('option');
      option.textContent = voices[i].name + ' (' + voices[i].lang + ')';

      if (voices[i].default) {
        option.textContent += ' -- DEFAULT';
      }

      option.setAttribute('data-lang', voices[i].lang);
      option.setAttribute('data-name', voices[i].name);
      voiceSelect.appendChild(option);
      if(voices[i].name.includes('UK English')){
        selectedIndex=i;
        break;
      }
    }
    voiceSelect.selectedIndex = selectedIndex;
  }

  populateVoiceList();
  if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = populateVoiceList;
  }

  function speak(isChatBot) {
    if (synth.speaking) {
      //console.error('speechSynthesis.speaking');
      return;
    }
    if (playBackTxt.value !== '') {
      var utterThis = new SpeechSynthesisUtterance(playBackTxt.value);

      $('.system-voice-animation').removeClass('hide').addClass('show');
      utterThis.onend = function (event) {
        //console.log('SpeechSynthesisUtterance.onend');
        $('.system-voice-animation').removeClass('show').addClass('hide');
        // if (isChatBot) {
        //   $(voiceRecordBtn).trigger('click');
        // }
      }
      utterThis.onerror = function (event) {
        //console.error('SpeechSynthesisUtterance.onerror');
      }
      var selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name');
      for (i = 0; i < voices.length; i++) {
        if (voices[i].name === selectedOption) {
          utterThis.voice = voices[i];
          break;
        }
      }
      utterThis.pitch = pitch.value;
      utterThis.rate = rate.value;
      synth.speak(utterThis);
    }
  }

  voiceTestBtn.onclick = function () {
    playBackTxt.value = voiceTestInput.value
    speak();
  }

  pitch.onchange = function () {
    pitchValue.textContent = pitch.value;
  }

  rate.onchange = function () {
    rateValue.textContent = rate.value;
  }

  voiceSelect.onchange = function () {
    speak();
  }

  startChatBtn.onclick = function () {
    setTimeout(() => {
      counter = 0;
      chatArea.innerHTML = ''
      var userName = document.getElementById("userName").value;
      var userGreeting = 'Welcome Geoff ';
      if (userName !== '') {
        userGreeting = userGreeting + userName
        userChatName = userName
      }
      userGreeting = userGreeting + 'How can I help you today?'
      helpContent = 'Some examples of things to say <br/><br/> \"I want to pay my bill\" <br/><br/> \"Where is my order?\"'
      addChatToChatArea(true, userGreeting, helpContent);
    }, 1000);
  }

  var addChatToChatArea = function (isChatBot, text, helpContent) {

    var html
    

    if (isChatBot) {
      if (counter === 0) {
        playBackTxt.value = text
        html = '<div class="hide"><span>' + text + '</span></div>'
      } else {
        playBackTxt.value = text
       if(text !==sorryText)
        // html = '<div class="serverChatBot"><strong>'+chatBotName+'</strong> says : <I>'+text+'</I></div>'
        html = '<div class="serverChatBot"><span>' + text + '</span></div>'
      }
      speak(isChatBot);
    } else {
      //console.log("-->1")
      if (text != null && text !== '') {
        //console.log("-->2")
        var newText=  text[0].toUpperCase() +  text.slice(1);
        // html = '<div class="userChatBot"><strong>'+userChatName+'</strong> says : <I>'+text+'</I></div>'
        html = '<div class="userChatBot"><span>' + newText + '</span></div>'
        
      } else {
       // console.log("-->3")
        playBackTxt.value = sorryText
        speak(isChatBot);
      }
    }
    if (helpContent) {
      helptext.innerHTML = helpContent;
    }
    $("#chatArea").append(html)
    var objDiv = document.getElementById("chatArea");
        objDiv.scrollTop = objDiv.scrollHeight;
    counter++;
  }

  var findResponse = function (speechResult) {
    var response = sorryText
    var responseMapper = [
      {
        keywords: 'I want to pay my bill #pay my bill #pay #bill',
        response: 'Would you like an update on your bill?',
        helpContent: 'Some examples of things to say <br/><br/> \"Yes" <br/><br/> \"No\"'
      },
      {
        keywords: 'Yes #Yes',
        response: 'Your last bill was £19.99, would you like me to email, text you the statement?',
        helpContent: 'Some examples of things to say <br/><br/> \"Email\" <br/><br/> \"Text"\ <br/><br/> \"No\"'
      },
      {
        keywords: 'Email #Email',
        response: 'Ok, I\'ll send you an email.'
      },
      {
        keywords: 'Thank you#Thanks',
        response: 'Thanks. Happy to help. Have a nice day.',
        helpContent:'Is there anything else you want to do today?'
      }
    ];

    responseMapper.forEach(function (value, key) {
      //console.log(key + ' = ' + value.keywords)
      var keyWordArray = value.keywords.split("#")
      for (var i = 0; i < keyWordArray.length; i++) {
        if (speechResult.toLowerCase().includes(keyWordArray[i].toLowerCase())) {
          response = value.response
          helpContent = value.helpContent
          break;
        }
      }
    })
    addChatToChatArea(true, response, helpContent);
  }

});