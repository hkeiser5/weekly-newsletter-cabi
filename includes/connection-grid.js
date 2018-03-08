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
			e.addEventListener('click', slidedwn, false);
		});
	
	function slidedwn(){
		let mySlider;
		let arrow;
		if(event.target.className === '.accordian') {
		   		mySlider = event.target.nextElementSibling;//select the adjacent slider element
				arrow = event.target.querySelector('.arrow');//selects the arrow for manipulation
		   } else { //in the event that a child of .accordian is clicked instead of the element called .accordian
			   let newET = event.target.closest('.accordian');
			   arrow = newET.querySelector('.arrow');
			   mySlider = newET.nextElementSibling;
		   }
		if (mySlider.style.maxHeight){
			mySlider.style.maxHeight = null;
			arrow.style.transform = 'rotate(0deg)';
		} else {
			mySlider.style.maxHeight = mySlider.scrollHeight + 'px';
			arrow.style.transform = 'rotate(90deg)';
		}
	}//end slidedwn
	
	//add event listener to all close icons
	let allMyClosures = document.querySelectorAll('.close');
		allMyClosures.forEach(function(e){
			e.addEventListener('click', slideup, false);
		});
	
	function slideup(){ //find appropiate .slidedown and change its display
		let mySlider = event.target.closest('.slidedown');
		let arrowMom  = mySlider.previousElementSibling;
		let arrow =  arrowMom.querySelector('.arrow');
		arrow.style.transform = 'rotate(0deg)';
		mySlider.style.maxHeight = null;
	}//end slideup
}//end accoridan function





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
}

window.onload = loadfunctions();