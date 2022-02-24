"use strict"

const dropdownButton = document.querySelector('.expand');
const dropdown = document.querySelector('.countryDropdown');
const dropdownElements = document.querySelectorAll('.countryDropdown .dropdown-item');
const countryInput = document.getElementById('inputCountry');
const remove = document.querySelectorAll('.remove');
const add = document.querySelectorAll('.add');
const quantity = document.querySelectorAll('.quantity');
const total = document.querySelector('#total');
const form = document.querySelector('form');
const fields = document.querySelectorAll(".form-element-input");
const formStatus = document.querySelector('.form-status');
const formStatusText = document.querySelector('.form-status p');
const clear = document.querySelectorAll('.clear');
const postalCode = {
	"United States of America" : /^\d{5}([ \-]\d{4})?/,
	"Spain" : /^\d{5}$/,
	"Germany" : /^\d{5}$/,
	"Canada" : /[ABCEGHJKLMNPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ ]?\d[ABCEGHJ-NPRSTV-Z]\d/,
	"Italy" : /^\d{5}$/
 } 

dropdownButton.addEventListener('click', ()=>{
	dropdown.classList.toggle("active")
});

countryInput.addEventListener('click', ()=>{
	dropdown.classList.toggle("active")
});

for(let i = 0; i < dropdownElements.length; i++){
	dropdownElements[i].addEventListener('click', (e)=>{
		countryInput.value = e.target.textContent;
		dropdown.classList.remove('active');
	})
};

for(let i = 0; i < remove.length; i++){
	remove[i].addEventListener('click', (e)=>{
		if (quantity[i].value > 0) {
			quantity[i].value = parseInt(quantity[i].value) - 1;	
		}
		total.textContent = "$" + (54.99 * (parseInt(quantity[0].value)) + (74.99 * parseInt(quantity[1].value)) + 19).toFixed(2);
	});
	add[i].addEventListener('click', (e)=>{
		if (quantity[i].value < 99) {
			quantity[i].value = parseInt(quantity[i].value) + 1;
		}
		total.textContent = "$" + ((54.99 * parseInt(quantity[0].value)) + (74.99 * parseInt(quantity[1].value)) + 19).toFixed(2);
	});
};


fields[0].addEventListener('keyup', (e)=>{
	if(localStorage.getItem(e.target.value)){
		if (confirm("There is already data saved for this email, do you want to use it? \nIf you don't, new data will overwrite old data")) {
			let data = JSON.parse(localStorage.getItem(e.target.value))
			for(let i = 0; i < data.length; i++){
				fields[i].value = data[i]
			}

		}
	}
})

for(let i = 0; i < clear.length; i++){
	if(i < 5){
		clear[i].addEventListener('click', ()=>{
			fields[i].value = "";
			for(let i = 0; i < fields.length - 2; i++){
				fields[i].style.color = "#000000"
			}
		})
	}else{
		clear[i].addEventListener('click', ()=>{
			fields[i+1].value = "";
			for(let i = 0; i < fields.length - 2; i++){
				fields[i].style.color = "#000000"
			}
		})
	}	
}

	



const validateEmail = (email)=>{
	return new Promise((res, rej)=>{
		if(email.value != "" && /\S+@\S+\.\S+/.test(email.value)){
			res(email)
		}else{
			rej(["Please provide your email", email, "red"])
		}
	})
}

const validateNumber = (number)=>{
	return new Promise((res, rej)=>{
		if(!/[a-z]/g.test(number.value) && 
			!/[!$%^&*_|~=`{}\[\]:";'<>?,.\/]/g.test(number.value)) {
			res(number)
		}else{
			rej(["please don´t use special characters", number, "red"])
		}
	})
}

const validateText = (text)=>{
	return new Promise((res, rej)=>{
		if(text.value != ""){
			res(text)
		}else{
			rej(["Please don´t leave empty fields", text, "red"])
		}
	})
}


form.addEventListener('submit', (e)=>{
	e.preventDefault()
	validateNumber(quantity[0]).then((item)=>{
		if((quantity[0].value > 0 && quantity[0].value < 100) || (quantity[1].value > 0 && quantity[1].value < 100)){
			item.style.color = "#000000";
			return validateNumber(quantity[1]);
		}else{
			throw ["You can't have less than 1 or more than 99 items", item, "#000000"]
		}	
	}).then((item)=>{
		if((quantity[0].value > 0 && quantity[0].value < 100) || (quantity[1].value > 0 && quantity[1].value < 100)){
			item.style.color = "#000000"
			return validateEmail(fields[0]);
		}else{
			throw ["You can't have less than 1 or more than 99 items", item, "#000000"]
		}		
	}).then((email)=>{
		email.style.color = "#4bb543";
		return validateNumber(fields[1]);
	}).then((number)=>{
		if(/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(number.value)){
			number.style.color = "#4bb543";
			return validateText(fields[2]);
		}else{
			throw ["Please provide a valid phone number", number, "red"]
		}
	}).then((name)=>{
		if(/^[a-z]([-']?[a-z]+)*( [a-z]([-']?[a-z]+)*)+$/.test(name.value)){
			name.style.color = "#4bb543";
			return validateText(fields[3]);
		}else{
			throw ["Please provide a valid name", name, "red"]
		}
	}).then((address)=>{
		address.style.color = "#4bb543";
		return validateText(fields[4]);
	}).then((city)=>{
		city.style.color = "#4bb543";
		return validateText(fields[5]);
	}).then((country)=>{
		country.style.color = "#4bb543";
		return validateText(fields[6]);
	}).then((postal)=>{
		let country = fields[5].value;

		if (postalCode[country].test(postal.value)) {
			if (fields[7].checked) {
				(function (args){

				let elements = []
				for(let i = 0; i < args.length - 2; i++){
				elements.push(args[i].value)

				}
				localStorage.setItem(fields[0].value, JSON.stringify(elements))
			})(fields);
			}
			postal.style.color = "#4bb543"
			formStatus.style.display = "flex"
			formStatusText.textContent = "Data send succesfully, your products will be with you soon"
			formStatusText.style.color = "#4bb543";
			
		}else{
			throw [`This postal code is not from ${country}`, postal, "red"]
		}
	}).catch((error)=>{
		formStatus.style.display = "flex";
		formStatusText.textContent = error[0];
		formStatusText.style.color = "red"
		error[1].style.color = error[2]
	})
})


