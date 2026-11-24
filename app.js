(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const STORE = 'sii-feedback-v1';
  const labels = ['Analyst','Creative thinker','Practical planner','Critical reviewer'];
  const roles = ['STRUCTURE','POSSIBILITIES','ACTION','CHECKS'];
  const localExamples = [
    {prompt:'How do I build a consistent learning habit?',answer:'Start small: choose one repeatable action, attach it to an existing daily cue, and make success easy to measure. Try it for a week, then adjust based on what got in the way.'},
    {prompt:'How can I brainstorm a project?',answer:'First define the outcome and constraints. Generate several different approaches before evaluating them, then choose one small experiment that can test your riskiest assumption.'},
    {prompt:'How do I solve a difficult problem?',answer:'Describe the problem in one sentence, separate known facts from assumptions, and break it into smaller questions. Test the most important uncertainty first; revise your plan as you learn.'}
  ];
  const getExamples = () => { try { const x = JSON.parse(localStorage.getItem(STORE) || '[]'); return Array.isArray(x) ? x : []; } catch { return []; } };
  const setCount = () => { $('dataCount').textContent = getExamples().length; };
  const escapeHTML = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const clean = s => String(s || '').replace(/\s+/g,' ').trim();
  function formulate(prompt, index) {
    const p = prompt.toLowerCase();
    const prior = getExamples().concat(localExamples).find(x => {
      const words = clean(x.prompt).toLowerCase().split(/\W+/).filter(w => w.length > 4);
      return words.length && words.filter(w => p.includes(w)).length >= Math.min(2, words.length);
    });
    const subject = clean(prompt).replace(/[?.!]+$/,'');
    const specific = prior ? `A related example from the available starter patterns suggests: “${prior.answer}”` : `First clarify what success would look like for “${subject}.”`;
    const variants = [
      `${specific} Separate the goal into the main question, the constraints, and what is already known.`,
      `Explore a few distinct routes for “${subject}” before settling on one. Include an unconventional option, then compare the likely benefits and trade-offs.`,
      `Turn “${subject}” into a small next step: choose one action you can try soon, decide what evidence to watch for, and set a point to review it.`,
      `Check the assumptions behind “${subject}.” What details are missing, what could make this advice unsuitable, and which claim should be verified?`
    ];
    return variants[index];
  }
  function synthesize(prompt, thoughts) {
    const p = clean(prompt).replace(/[?.!]+$/,'');
    const lead = `For “${p},” begin by making the desired outcome and any constraints explicit. `;
    const middle = `Consider more than one approach, then select a small, reversible first step that tests the most important assumption. `;
    const finish = `Review what happened and update the plan. The suggestions here are generated from local templates, not independent trained models; verify important or high-stakes details with reliable sources.`;
    return lead + middle + finish;
  }
  function card(name, role, content, extra='') {
    return `<article class="agent-card ${extra}"><div class="agent-head"><span class="agent-name">${escapeHTML(name)}</span><span class="agent-role">${escapeHTML(role)}</span></div><p>${escapeHTML(content)}</p></article>`;
  }
  $('prompt').addEventListener('input', e => $('charCount').textContent = `${e.target.value.length} / 1600`);
  $('promptForm').addEventListener('submit', e => {
    e.preventDefault(); const prompt = clean($('prompt').value); if (!prompt) return;
    const run = $('runButton'); run.disabled = true; run.querySelector('span').textContent = 'Thinking…';
    $('results').hidden = false; $('finalCard').hidden = true;
    const ideas = labels.map((_,i) => formulate(prompt,i));
    $('agentGrid').innerHTML = labels.map((n,i) => card(n,roles[i],ideas[i])).join('') + card('Synthesis A','COMMON GROUND',`The shared thread is to clarify the outcome, compare options, and take a manageable first step.`, 'synth') + card('Synthesis B','QUALITY CHECK',`The plan should state assumptions, identify a way to evaluate progress, and invite revision if the context changes.`, 'synth') + card('Mini-agent · Coach','LOCAL FEEDBACK',`A useful answer should be concrete, proportionate, and leave room for the user’s context.`, 'mini-agent') + card('Mini-agent · Editor','LOCAL FEEDBACK',`Prefer a clear next action over an overconfident claim. The current browser build cannot fetch Gemini suggestions.`, 'mini-agent');
    $('finalAnswer').textContent = synthesize(prompt,ideas); $('finalCard').hidden = false; $('feedbackStatus').textContent=''; document.querySelectorAll('.feedback-btn').forEach(b=>b.classList.remove('selected'));
    run.disabled = false; run.querySelector('span').textContent = 'Run the team'; $('results').scrollIntoView({behavior:'smooth',block:'start'});
  });
  document.querySelectorAll('.feedback-btn').forEach(btn => btn.addEventListener('click', () => {
    const prompt = clean($('prompt').value); if (!prompt) return;
    const examples = getExamples(); examples.unshift({prompt, answer:$('finalAnswer').textContent, rating:btn.dataset.rating, savedAt:new Date().toISOString()});
    try { localStorage.setItem(STORE, JSON.stringify(examples.slice(0,100))); $('feedbackStatus').textContent='Saved in this browser'; setCount(); btn.classList.add('selected'); }
    catch { $('feedbackStatus').textContent='Browser storage is unavailable'; }
  }));
  const dialog = $('dataDialog');
  const openDialog = () => { $('dataMessage').textContent=''; dialog.showModal(); };
  $('dataButton').addEventListener('click',openDialog); $('learnMore').addEventListener('click',openDialog); $('closeDialog').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
  $('exportButton').addEventListener('click',()=>{const blob=new Blob([JSON.stringify(getExamples(),null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='sii-feedback-examples.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);$('dataMessage').textContent='Export downloaded.';});
  $('resetButton').addEventListener('click',()=>{localStorage.removeItem(STORE);setCount();$('dataMessage').textContent='Local examples deleted.';});
  $('clearButton').addEventListener('click',()=>{$('results').hidden=true;$('prompt').focus();});
  setCount();
})();
