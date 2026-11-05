export function setupLiveConversation(onReply) {
  const classifyAndReply = (text) => {
    const q = text.toLowerCase();
    if (q.includes('selam') || q.includes('merhaba') || q.includes('hey') || q.includes('wave')) {
      return { gesture: 'FriendlyWave', msg: 'Selam Kanka! Jimmy reporting on 17-DoF ROS 2 bus!' };
    }
    if (q.includes('rust') || q.includes('kod') || q.includes('code') || q.includes('help') || q.includes('clippy')) {
      return { gesture: 'CyberClippyLean', msg: 'Looks like you are architecting ROS 2 + OpenXR! Need a hand?' };
    }
    if (q.includes('neden') || q.includes('why') || q.includes('bilmiyorum') || q.includes('shrug')) {
      return { gesture: 'ItalianShrug', msg: 'Single monitor? In 2026 we use Quest 3 Passthrough!' };
    }
    return { gesture: 'PresentPalmHologram', msg: `Omni-Tool analyzed: "${text.slice(0, 28)}"` };
  };

  window.askJimmyText = () => {
    const inp = document.getElementById('jimmy-input');
    if (!inp || !inp.value.trim()) return;
    onReply(classifyAndReply(inp.value.trim()));
    inp.value = '';
  };

  window.startJimmyVoiceMic = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      onReply({ gesture: 'CyberClippyLean', msg: 'Mic API unavailable; type in Omni-Console below!' });
      return;
    }
    const rec = new SR();
    rec.lang = 'tr-TR';
    rec.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      onReply(classifyAndReply(transcript));
    };
    rec.start();
  };
}
