var Trade = Parse.Object.extend("Trade",{
	validateData:function(){
		this.validationErrors = {};
		var userId = this.get('userId');
		var currencyFrom = this.get('currencyFrom');
		var currencyTo = this.get('currencyTo');
		var amountSell = this.get('amountSell');
		var amountBuy = this.get('amountBuy');
		var rate = this.get('rate');
		var timePlaced = this.get('timePlaced');
		var originatingCountry = this.get('originatingCountry');
		var valid = true;
		if(!userId){
			this.validationErrors.userId = "required";
			valid = false;
		}
		if(!currencyFrom){
			this.validationErrors.currencyFrom = "required";
			valid = false;
		}
		if(!currencyTo){
			this.validationErrors.currencyTo = "required";
			valid = false;
		}
		if(!amountSell){
			this.validationErrors.amountSell = "required";
			valid = false;
		} else if(isNaN(parseFloat(amountSell)) || !isFinite(amountSell)){
			this.validationErrors.amountSell = "numeric value required";
			valid = false;
		}
		if(!amountBuy){
			this.validationErrors.amountBuy = "required";
			valid = false;
		} else if(isNaN(parseFloat(amountBuy)) || !isFinite(amountBuy)){
			this.validationErrors.amountBuy = "numeric value required";
			valid = false;
		}
		if(!rate){
			this.validationErrors.rate = "required";
			valid = false;
		} else if(isNaN(parseFloat(rate)) || !isFinite(rate)){
			this.validationErrors.rate = "numeric value required";
			valid = false;
		}
		if(!timePlaced){
			this.validationErrors.timePlaced = "required";
			valid = false;
		}
		if(timePlaced && (new Date(timePlaced) === "Invalid Date" || isNaN(new Date(timePlaced)))){
			this.validationErrors.timePlaced = "invalid date/time";
			valid = false;
		}
		if(!originatingCountry){
			this.validationErrors.originatingCountry = "required";
			valid = false;
		}
		if(!originatingCountry){
			this.validationErrors.originatingCountry = "required";
			valid = false;
		}
		if(amountBuy && amountSell && rate){

			var rateCalc = (amountBuy / amountSell).toFixed(2);
			var rateCheck = rate.toFixed(2);
			if(rateCalc != rateCheck){
				this.validationErrors.rate = "incorrect rate";
				valid = false;
			}
		}
		return valid;
	},
	validationErrors:{}
});
module.exports = Trade;
