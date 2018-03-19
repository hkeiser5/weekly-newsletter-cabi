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



//create js select boxes-----pta, better to use a framework, but good experience in learing lots of code basics
function replaceSelects(){
	//first find our selects and replace them with the divs
	let mySelects = document.querySelectorAll('select');
	mySelects.forEach(function(e){
		let myDefault = e[0].innerHTML;//options default value
		let myName = e.getAttribute('name');
		let selectDiv = document.createElement('div');//new div for select
		selectDiv.classList.add('select');
		selectDiv.setAttribute('data-name', myName);
		selectDiv.setAttribute('tabindex',0);
		selectDiv.setAttribute('role','listbox');//aria role - tells screen readers function
		let myNewDefault = document.createElement('div');
		myNewDefault.classList.add('select-header');//new div for select-header
		let myDefaultSpan = document.createElement('span');//new span for default value
		myDefaultSpan.classList.add('value');
		myDefaultSpan.innerHTML = myDefault;
		let myNewArrow = document.createElement('div');//new div for arrow
		myNewArrow.classList.add('select-arrow');
		myNewArrow.innerHTML = '<i class="fas fa-caret-right"></i>';//font awesome arrow
		myNewDefault.appendChild(myDefaultSpan);
		myNewDefault.appendChild(myNewArrow);
		selectDiv.appendChild(myNewDefault);
		let myNewList = document.createElement('ul');//new ul for the options------
		myNewList.classList.add('optionList');
		myNewList.classList.add('hidden');
		myNewList.setAttribute('role','presentation');//aria role - presentation tells screen readers to ignor
		let onlyMyOptions = [];//this will hold only the options, not the optgroup divs
		
		//now add all option/optionGroup uls/lis to add to myNewList
		for (let i=1; i <e.length; i++){//start at 1 as 0 was the first default option
			let nodeHTML = e[i].innerHTML;
			let nodeValue = e[i].getAttribute('value');
			let myNewOption = document.createElement('li');
			myNewOption.innerHTML = nodeHTML;
			myNewOption.setAttribute('data-value', nodeValue);
			myNewOption.classList.add('option');
			myNewOption.setAttribute('role','option');
			onlyMyOptions.push(myNewOption);
			myNewOption.addEventListener('mouseover',function(){//highlights options
				highlightOption(selectDiv,event.target);
				let myIndex = onlyMyOptions.indexOf(event.target);
				updateSelectValue(selectDiv,myIndex);
			});
			
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
					groupUl.setAttribute('role','presentation');
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
		//set max-height on myNewList for nicer transitions
		let listHeight;
		let listChildren = myNewList.children;
		for (let k=0; k<listChildren.length; k++){
			let myHeight = listChildren[k].height;
			listHeight += myHeight;
		}
		
		myNewList.style.maxHeight = listHeight + 10 + 'px';
		
		let myParent = e.parentElement;
		for (let k = 0; k < myParent.length; k++){
			if (myParent[k] === e){
				myParent.insertBefore(selectDiv,myParent[k].nextSibling);
				myParent[k].style.visibility = 'hidden';
				myParent[k].style.maxHeight = 0;
				myParent[k].style.maxWidth = 0;
				myParent[k].tabIndex = -1;
				break;
			}
		}
		let selectedIndex = getIndex(selectDiv);
		
		selectDiv.addEventListener('focus',function(){//gain focus on clicks/tabulation
			activateSelect(selectDiv,mySelects);
		});
		selectDiv.addEventListener('blur',function(){//deactivate on loss of focus
			deactivateSelect(selectDiv);
		});
		selectDiv.addEventListener('click',function(){//selects & shows the box when clicked
			toggleOptList(selectDiv);
		});
		selectDiv.addEventListener('keyup',function(event){
			let length = myNewList.length;
			selectedIndex = getIndex(selectDiv);
			//if it is up after a down arrow change focus
			if (event.keyCode === 40 && selectedIndex < length - 1) { 
				selectedIndex++; 
			}
			//same if it is a down arrow
			if (event.keyCode === 38 && selectedIndex > 0) { 
				selectedIndex--; 
			}
			
		});
	});
	//functionality of selectdivs
	function deactivateSelect(select){
		// If the widget is not active there is nothing to do
		if (!select.classList.contains('active')) {
			return;
		}
		//the list of options and hide them
		let optList = select.querySelector('.optionList');
		optList.classList.add('hidden');
		let selArrow = select.querySelector('.select-arrow');
		//deactivate closed select
		select.classList.remove('active');
		selArrow.classList.remove('active');
	}
	function activateSelect(select, selectList) {
		// If the widget is not active there is nothing to do
		if (select.classList.contains('active')) {
			return;
		}
		// deactivate all selects
		selectList.forEach(deactivateSelect);
		// activate chosen select
		select.classList.add('active');
		let selArrow = select.querySelector('.select-arrow');
		selArrow.classList.remove('active');
	}
	//toggle opening of options of Selects
	function toggleOptList(select) {
		//get the option list
		let optList = select.querySelector('.optionList');
		let selArrow = select.querySelector('.select-arrow');
		//toggle it's visiblility
  		optList.classList.toggle('hidden');
		selArrow.classList.toggle('active');
	}
	//highlight option
	function highlightOption(select, option){
		//get all the options
		let allOptions = select.querySelectorAll('.option');
		//remove highlight from all
		allOptions.forEach(function (e) {
    		e.classList.remove('highlight');
  		});
		//add to current option
		option.classList.add('highlight');
	}
	//adjust value to send to form
	function updateSelectValue(select,index){
		//get hidden native select box
		var nativeWidget = select.previousElementSibling;
		//value placeholder(span) in custom made box
		var value = select.querySelector('.value');
		//get all the options
		var allOptions = select.querySelectorAll('.option');
		//make all unselected
		allOptions.forEach(function (e) {
    		e.setAttribute('aria-selected', 'false');
  		});
		//then select the chosen option
		allOptions[index].setAttribute('aria-selected', 'true');
		//set the value on native widget
		nativeWidget.selectedIndex = index+1;
		//update the value in custom widget
		value.innerHTML = allOptions[index].innerHTML;
		//highlight corrosponding option
		highlightOption(select, allOptions[index]);
	}
	//get the current selected index of native widget
	function getIndex(select){
		var nativeWidget = select.previousElementSibling;
		return nativeWidget.selectedIndex;
	}
}//This completes creating a new select dropdown out of divs from select tags in doc and removes previous selects.


//handling multiple select widgets in the dates and times of drpset
function drpsetForm (){
	let drpsets = document.querySelectorAll('.drpset>form');
	//get all the children in this set
	drpsets.forEach(function(drpset){
		let drpselects = drpset.querySelectorAll(':scope >.select');
		let myBtn = drpset.querySelector(':scope >a>button');
		hideDrpset(drpselects,myBtn);
		drpselects.forEach(function(select){
			let myoptions = select.querySelectorAll('.option');
			myoptions.forEach(function(opt){
				opt.addEventListener('click', function(){
				showDrpBut(drpselects,select,myBtn);
				});
			});
		});
	
	});	
	//functions that show each element one at a time
	function hideDrpset (selects,btn){
		for (let i=1; i<selects.length; i++){
				selects[i].classList.add('hidden');
		}
		btn.classList.add('hidden');
	}
	function showDrpBut(drpselects,curselect,btn){
		//need to find index of curselect in drpselects
		let myIndex;
		for(let i=0; i<drpselects.length; i++){
			if (curselect === drpselects[i]){
				myIndex = i;
				break;
			}
		}
		if (curselect === drpselects[drpselects.length -1]) {
			btn.classList.remove('hidden');//no need to check if exists, removing only works if class is there
		} else {
			let mySister = drpselects[myIndex +1];
			mySister.classList.remove('hidden');//no need to check if exists, removing only works if class is there
		}
		
	}
}
//function that changes the times to timezone chosen in a select dropbox, and dates based off of a speaker selection in a select dropbox. Unique to page information so not universal functionality

function limitOptions(){
	//select the box that has speaker names
	let speaker = document.querySelector('.select[data-name="speaker"]');
	let speakerOpts = speaker.querySelectorAll('.option');
	let speakValue;
	let zoneValue;
	
	//select the box with timezones
	let timezone = document.querySelector('.select[data-name="timezone"]');
	let tzones = timezone.querySelectorAll('.option');
	//select the box with the dates and times available
	let choosedate = document.querySelector('.select[data-name="choosedate"]');
	let choosegrp = choosedate.querySelectorAll('.optionGroup');// has a div with data-group matches the speak values all lowercase
	let chooseOpt = choosedate.querySelectorAll('.option');
	
	speakerOpts.forEach(function(opt){//set in choosedate only options from person selected
		opt.addEventListener('click',function(){
			speakValue = event.target.getAttribute('data-value');
			speakValue = speakValue.toLowerCase();
			//change options available in choosedate based on this value
			for (let i=0; i<choosegrp.length; i++){
				let myDiv = choosegrp[i].querySelector(':scope > div');
				if (myDiv.getAttribute('data-group') !== speakValue){
					choosegrp[i].style.display = 'none';
				}
			}
		});
	});//end choose date
	
	tzones.forEach(function(zone){//set times and dates of choose date options based on timezone
		zone.addEventListener('click',function(){
			zoneValue = event.target.getAttribute('data-value');
			//now adjust the date/time of choose options based on this value
			for (let i=0; i<chooseOpt.length; i++){
				//data-value is formatted like December 14, 2017, 9:00 am
				let strvalue = chooseOpt[i].getAttribute('data-value');
				//need to cut off everything after " PT" in the string
				strvalue = strvalue.replace(/\sPT.*?/g , "$1");
				
				let curValue = moment(strvalue, 'MMMM D, YYYY, h:mm a');
				
				let hour = curValue.hour();
				if (zoneValue === 'PT'){
					//do nothing, all dates start in PT
				} else if (zoneValue === 'MT'){//add 1 hour to the date
					hour += 1;
				} else if (zoneValue === 'CT'){//add 2 hours to date
					hour += 2;
				} else if (zoneValue === 'ET'){//add 3 hours to the date
					hour += 3;
				} else if (zoneValue === 'GMT'){//add 7 hours to the date
					hour += 7;
				}
				curValue.hour(hour);
				let newForm = curValue.format("dddd, MMMM D | h:mm a");
				newForm = newForm.toString();
				//add dots in am/pm
				newForm = newForm.replace(/m$/g, ".m.");
				//now replace innerHtml
				chooseOpt[i].innerHTML = newForm;
			}
		});	
	});//end set time	
	//last we want to change the mailto to include the options chosen in the email reminder that happens when someone clicks the remind me button.
	
	let myButton = choosedate.nextElementSibling.querySelector('button');
	let myForm = myButton.closest('form');
	myButton.addEventListener('click',function(){
		let speakerValue = speaker.querySelector('.value').innerHTML;
		let chosenDateTime = choosedate.querySelector('.value').innerHTML;
		let subandbody = 'mailto:test@example.com?subject=Your upcomming webinar with '+speakerValue;//'?Body=Your webinar will be held on '+ chosenDateTime;
		let chsdateNative = choosedate.previousElementSibling;//need current index value
		let timeIndex = chsdateNative.selectedIndex;
		chsdateNative[timeIndex].setAttribute('value', chosenDateTime);
		myForm.setAttribute('action', subandbody);
	});
}//end limitOptions function



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
	drpsetForm();
	limitOptions();

}

window.onload = loadfunctions();