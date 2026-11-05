export function formatGuessAmount(value, decimal = false) {
  if (decimal) {
    const text =
      typeof value === 'number'
        ? value.toLocaleString('tr-TR', { maximumFractionDigits: 2 })
        : String(value ?? '');
    const [whole, ...fraction] = text.split(',');
    return (
      formatGuessAmount(whole) +
      (fraction.length ? ',' + fraction.join('').replace(/\D/g, '').slice(0, 2) : '')
    );
  }
  const digits = String(value ?? '')
    .replace(/\D/g, '')
    .replace(/^0+(?=\d)/, '');
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}
export function parseGuessAmount(value, decimal = false) {
  if (decimal) {
    const text = String(value ?? '').replace(/[.\s]/g, '');
    return /^\d+(,\d{0,2})?$/.test(text) ? Number(text.replace(',', '.')) : NaN;
  }
  const digits = String(value ?? '').replace(/[.\s]/g, '');
  if (!/^\d+$/.test(digits)) return NaN;
  const amount = Number(digits);
  return Number.isSafeInteger(amount) ? amount : NaN;
}
export const guessInputClient = String.raw`
const formatGuessAmount=${formatGuessAmount.toString()};
const parseGuessAmount=${parseGuessAmount.toString()};
let guessDraftKey='',guessDraftValue='';
function formatGuessInput(input,event){
 if(event?.isComposing)return;
 const before=input.value,position=input.selectionStart??before.length,digitsBefore=before.slice(0,position).replace(/\D/g,'').length,formatted=formatGuessAmount(before,room?.mode==='product-price');
 if(formatted!==before){input.value=formatted;let caret=0,count=0;while(caret<formatted.length&&count<digitsBefore){if(/\d/.test(formatted[caret]))count++;caret++}if(document.activeElement===input)input.setSelectionRange(caret,caret)}
 if(room){guessDraftKey=room.code+'-'+(room.gameId||'legacy')+'-'+room.round;guessDraftValue=input.value}
}
function multiplyGuess(multiplier){const input=$('#guess');if(!input||input.disabled||busy)return;const amount=parseGuessAmount(input.value,room?.mode==='product-price');if(!Number.isFinite(amount)||amount<1){input.focus();return}const result=Math.round(amount*multiplier*100)/100;if(!Number.isFinite(result)||result>10000000000){toast('Tahmin en fazla 10.000.000.000 TL olabilir.');input.focus();return}input.value=formatGuessAmount(result,room?.mode==='product-price');input.focus();input.setSelectionRange(input.value.length,input.value.length);if(room){guessDraftKey=room.code+'-'+(room.gameId||'legacy')+'-'+room.round;guessDraftValue=input.value}}
`;
