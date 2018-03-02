// JavaScript Document
/*jslint node: true */
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
		for (let num = myLength - 1; num > 0; num--){	
			if (myLength % num === 0){
				myFactors.push(num);//this array will have all positive factors (outside of self), and will result in 1 length for primes.
			}
		}
		
		
		//determine width of columns based on factors, baseWidth, and myWidth
		//first check if all columns will fit in space, if so do nothing
		if(baseWidth*myLength < myWidth || myFactors.length === 1){
			//do nothing everything fits or will go to default min-width of 150px for prime number of columns

		} else if {// here we determine how much space we have and divide columns accordingly
			for (let value of myFactors){
				if (value*baseWidth < myWidth){
						for (let i=0; i<myLength; i++){
							allMyChildren[i].style.minWidth === 100/value + '%';
						}
					break;
				}
			}
		} else {
			for (let i=0; i<myLength; i++){
				allMyChildren[i].style.minWidth === 100 + '%';
			}
		}
		
	});
}

function loadfunctions(){
	columnwidth();
}

window.onload = loadfunctions();