// JavaScript Document
/*jslint node: true */
/*jshint esversion: 6 */
'use strict';


/* grid algorythm that determines how many .column elements in a .row. sees how big the row is. then determines width of the .column elements based on space, and if it has any denominators based on amount to section the widths in even amounts.*/

function columnwidth(){
	//this should affect whole page, so first we need to find every .row element
	let allMyRows = document.querySelectorAll('.row');
	
	//we want a base minimum width for every column, I don't want them smaller than 150px
	let baseWidth = 150;
	
	//loop through all of the rows 
	allMyRows.forEach(function(e){
		//we need to know how wide the width is for the parent row
		let myWidth = e.offsetWidth;
		
		//find direct children columns and how many there are
		let allMyChildren = e.querySelectorAll(':scope >.column');//only selects the direct children of element

		let myLength = allMyChildren.length;
		
		//find all the factors for my Length, take a number then try to divide it equally by every number smaller then itself, each success is a factor and can be put into an array.
		let myFactors = [];
		for (let num = myLength ; num > 0; num--){	
			if (myLength % num === 0){
				myFactors.push(num);//this array will have all positive factors, and will result in 2 length for primes.
			}
		}
		
		function setMinWidt(myarray,myvalue){
			for (let i=0; i<myarray.length; i++){
				myarray[i].style.minWidth = myvalue;
			}
		}
		//determine width of columns based on factors, baseWidth, and myWidth
		//first check if all columns will fit in space, if so do nothing
		if(baseWidth*myLength < myWidth){
			let v = 150 + 'px'; //reset min width if enlarging
			setMinWidt(allMyChildren,v); 
			
			//do some different math for prime number of columns, lets set it up so that it tries to evenly spread the groups of columns, like a row of 6 then 5, or 2 rows of 4 then a row of 3, ect.
		} else if (myWidth <= 320){
			setMinWidt(allMyChildren,'100%');
		} else if (myFactors.length === 2 ){
				   for (let i=2; i < myLength; i++){
					   let val = Math.ceil(Math.round(myLength/i));
					   if (val*baseWidth < myWidth && val !== 1){ //if equal to one, let it default to normal widths/distributions
						   let v = 100/val + '%';
						   setMinWidt(allMyChildren,v);
						   break;
					   }
				   }
				   
		} else { // here we determine how much space we have and divide columns accordingly
			for (let value of myFactors){
				if (value*baseWidth < myWidth && myWidth > 320){ //if smaller than 320 only allow single columns
					let v = 100/value + '%';	
					setMinWidt(allMyChildren,v);
					break; 
					
				}
			}
		} 
		
	});
}//end of column width function


//accordian functions for slide down information in sections, or anywhere.
function accordian(){
//add event listener to all arrow icons
	let allMyArrows = document.querySelectorAll('.accordian');
		allMyArrows.forEach(function(e){
			let mySlider = e.nextElementSibling;
			let myArrow = e.querySelector('.arrow');
			e.addEventListener('click', function(){
				togglesld(mySlider);
				rotatearrow(myArrow);}, 
				false);
		});
	
	function togglesld(mySlider){
		if (mySlider.style.maxHeight){
			mySlider.style.maxHeight = null;
		} else {
			mySlider.style.maxHeight = mySlider.scrollHeight + 'px';
		}
	}//end togglesld
	
	function rotatearrow(arrow){//arrow must be a seperate item class from the icon from font awesome to work. good to know
		if (arrow.style.transform === 'rotate(90deg)'){
			arrow.style.transform = 'rotate(0deg)';
		} else {
			arrow.style.transform = 'rotate(90deg)';
		}
	}
	
	//add event listener to all close icons
	let allMyClosures = document.querySelectorAll('.close');
		allMyClosures.forEach(function(e){
			let mySlider = e.closest('.slidedown');
			let myArrowMom = mySlider.previousElementSibling;
			let myArrow =  myArrowMom.querySelector('.arrow');
			e.addEventListener('click', function(){
				togglesld(mySlider);
				rotatearrow(myArrow);}, 
				false);
		});
	
	
}//end accoridan function


/*select box widget here is the heirarchy of the select box classes:
   div.select (holds everything)
   		div.select-header (contains span.value and div.select-arrow)
		ul.optionList
			li.option or li.optionGroup (this then contains a ul without class that holds all li.option)
*/
//first find our selects and replace them with the div code
function replaceSelects(){
	let mySelects = document.querySelectorAll('select');
	mySelects.forEach(function(e){
		let myDefault = e[0].innerHTML;//options default value
		let myName = e.getAttribute('name');
		let selectDiv = document.createElement('div');//new div for select
		selectDiv.classList.add('select');
		selectDiv.setAttribute('data-name', myName);
		let myNewDefault = document.createElement('div');
		myNewDefault.classList.add('select-header');//new div for select-header
		let myDefaultSpan = document.createElement('span');//new span for default value
		myDefaultSpan.innerHTML = myDefault;
		let myNewArrow = document.createElement('div');//new div for arrow
		myNewArrow.classList.add('select-arrow');
		myNewArrow.innerHTML = '<i class="fas fa-caret-right"></i>';//font awesome arrow
		myNewDefault.appendChild(myDefaultSpan);
		myNewDefault.appendChild(myNewArrow);
		selectDiv.appendChild(myNewDefault);
		let myNewList = document.createElement('ul');//new ul for the options------
		myNewList.classList.add('optionList');
		//now add all option/optionGroup uls/lis to add to myNewList
		for (let i=1; i <e.length; i++){//start at 1 as 0 was the first default option
			let nodeHTML = e[i].innerHTML;
			let nodeValue = e[i].getAttribute('value');
			let myNewOption = document.createElement('li');
			myNewOption.innerHTML = nodeHTML;
			myNewOption.setAttribute('data-value', nodeValue);
			myNewOption.classList.add('option');
			
			if (e[i].parentNode.label !== undefined){ //this option is part of an optgroup
				let optGroupLabel = e[i].parentNode.label;
				//check to see if we have an optgroup div already
				let grpCheck = myNewList.querySelector('[data-group="'+optGroupLabel+'"]');
				if (grpCheck !== null){
					grpCheck.parentElement.appendChild(myNewOption);
				} else {
					let groupLi = document.createElement('li');//this will become the optiongroup li that holds ul
					groupLi.classList.add('optionGroup');
					let groupUl = document.createElement('ul');
					let labelDiv = document.createElement('div');
					labelDiv.setAttribute('data-group', optGroupLabel);
					labelDiv.innerHTML = e[i].parentNode.label;
					groupLi.appendChild(labelDiv);
					groupUl.appendChild(myNewOption);
					groupLi.appendChild(groupUl);
					myNewList.appendChild(groupLi);
				}
				
			} else {
				myNewList.appendChild(myNewOption);
			}
			
		}
		selectDiv.appendChild(myNewList);//select div now has all elements added and is ready to replace select in DOM
		let myParent = e.parentElement;
		for (let k = 0; k < myParent.length; k++){
			if (myParent[k] === e){
				//myParent.removeChild(myParent[k]);
				myParent.replaceChild(selectDiv, myParent[k]);
				break;
			}
		}
	});
}//This completes creating a new select dropdown out of divs from select tags in doc and removes previous selects.



//handling multiple select widgets in the dates and times of webinars




//timer function to use in things like window resize.
var timeout;


// Listen for resize events
window.addEventListener('resize', function  () {

	// If timer is null, reset it to 66ms and run your functions.
	// Otherwise, wait until timer is cleared
	if ( !timeout ) {
		timeout = setTimeout(function() {

			// Reset timeout
			timeout = null;
			
			columnwidth();


		}, 66);
	}
}, false);









function loadfunctions(){
	columnwidth();
	accordian();
	replaceSelects();
}

window.onload = loadfunctions();