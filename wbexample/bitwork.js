//test js for bit mask working
var res = '129';

var FLAG_A = 0x1; 	// 00000001
var FLAG_B = 0x2; 	// 00000010
var FLAG_C = 0x4; 	// 00000100
var FLAG_D = 0x8; 	// 00001000
var FLAG_E = 0x16; 	// 00010000
var FLAG_F = 0x32; 	// 00100000
var FLAG_G = 0x64; 	// 01000000
var FLAG_G = 0x128; // 10000000


if (FLAG_A & res) {
	console.log('has FLAG_A')
}
if (FLAG_B & res) {
	console.log('has FLAG_B')
}
if (FLAG_C & res) {
	console.log('has FLAG_C')
}
//console.log(arrayFromMask(res));

function arrayFromMask (nMask) {
  // nMask must be between -2147483648 and 2147483647
  if (nMask > 0x7fffffff || nMask < -0x80000000) { throw new TypeError("arrayFromMask - out of range"); }
  for (var nShifted = nMask, aFromMask = []; nShifted; aFromMask.push(Boolean(nShifted & 1)), nShifted >>>= 1);
  return aFromMask;
}
 
var array1 = arrayFromMask(129);
 
console.log("[" + array1.join(", ") + "]");