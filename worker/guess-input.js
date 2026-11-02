export function formatGuessAmount(value){
 const digits=String(value??'').replace(/\D/g,'').replace(/^0+(?=\d)/,'');return digits.replace(/\B(?=(\d{3})+(?!\d))/g,'.');
}
export function parseGuessAmount(value){
 const digits=String(value??'').replace(/[.\s]/g,'');if(!/^\d+$/.test(digits))return NaN;const amount=Number(digits);return Number.isSafeInteger(amount)?amount:NaN;
}
export const guessInputClient=String.raw`
const formatGuessAmount=${formatGuessAmount.toString()};
const parseGuessAmount=${parseGuessAmount.toString()};
let guessDraftKey='',guessDraftValue='';
function formatGuessInput(input,event){
 if(event?.isComposing)return;
 const before=input.value,position=input.selectionStart??before.length,digitsBefore=before.slice(0,position).replace(/\D/g,'').length,formatted=formatGuessAmount(before);
 if(formatted!==before){input.value=formatted;let caret=0,count=0;while(caret<formatted.length&&count<digitsBefore){if(/\d/.test(formatted[caret]))count++;caret++}if(document.activeElement===input)input.setSelectionRange(caret,caret)}
 if(room){guessDraftKey=room.code+'-'+room.round;guessDraftValue=input.value}
}
function multiplyGuess(multiplier){const input=$('#guess');if(!input||input.disabled||busy)return;const amount=parseGuessAmount(input.value);if(!Number.isFinite(amount)||amount<1){input.focus();return}const result=amount*multiplier;if(!Number.isSafeInteger(result)||result>10000000000){toast('Tahmin en fazla 10.000.000.000 TL olabilir.');input.focus();return}input.value=formatGuessAmount(result);input.focus();input.setSelectionRange(input.value.length,input.value.length);if(room){guessDraftKey=room.code+'-'+room.round;guessDraftValue=input.value}}
`;
