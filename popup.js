const hamburger_icon = document.getElementById("menu-hamburger");
const close_sidebar = document.getElementById("close_sidebar");
const sidebar = document.getElementById("sidebar");
const nav = document.getElementById("nav");
const content = document.getElementById("content");
const main_block = document.getElementsByClassName("main_block")[0];
const bottom_menu = document.getElementById("bottom_menu");
const overlay = document.getElementById("overlay");
const wallet_address = document.getElementsByClassName("wallet")[0];
var addNewWallet = document.getElementById("addNewWallet");

const bottom_menu_items = document.querySelectorAll(".item");
const listOfTokens = document.getElementById("listOfTokens");
const refreshAndSort = document.getElementById("refreshAndSort");
var refreshBtn = null;

var cet_total = document.getElementById("cet_total");
var showMoreBlock = document.getElementById("showMoreBlock");
var showMoreBtn = document.getElementById("showMoreBtn");

const networkIndicator = document.getElementById("networkIndicator");

const chains = [
	{"title":"CoinEx Smart Chain Mainnet", "id" : 52, "type":"mainnet"},
]

if(!localStorage.getItem("walletsStorage") || JSON.parse(localStorage.getItem("walletsStorage")).length == 0){
	localStorage.setItem("walletsStorage", JSON.stringify([]));
	localStorage.setItem("currentWallet", null);
} 
else {
	if(!localStorage.getItem("currentWallet")){
		localStorage.setItem("currentWallet", JSON.parse(localStorage.getItem("walletsStorage"))[0].address);

		var indexOfWallet = JSON.parse(localStorage.getItem("walletsStorage")).findIndex((obj => obj.address == localStorage.getItem("currentWallet")));
		var nameWal = JSON.parse(localStorage.getItem("walletsStorage"))[indexOfWallet].name;
		var addWal = JSON.parse(localStorage.getItem("walletsStorage"))[indexOfWallet].address;
		wallet_address.classList.add("exist");
		wallet_address.innerHTML = `<span>${nameWal}</span> ${addWal.substring(0, 4)}...${addWal.substring(38)}`;

		if(wallet_address.classList.contains("exist")){
			wallet_address.addEventListener("click", ()=>{
				navigator.clipboard.writeText(localStorage.getItem("currentWallet"));
			})
		}

	} else{
		var checkThisAddress = JSON.parse(localStorage.getItem("walletsStorage")).findIndex((obj => obj.address == localStorage.getItem("currentWallet")));
		if(checkThisAddress < 0){
			localStorage.setItem("currentWallet", JSON.parse(localStorage.getItem("walletsStorage"))[0].address);
		}

		var indexOfWallet = JSON.parse(localStorage.getItem("walletsStorage")).findIndex((obj => obj.address == localStorage.getItem("currentWallet")));
		var nameWal = JSON.parse(localStorage.getItem("walletsStorage"))[indexOfWallet].name;
		var addWal = JSON.parse(localStorage.getItem("walletsStorage"))[indexOfWallet].address;
		wallet_address.classList.add("exist");
		wallet_address.innerHTML = `<span>${nameWal}</span> ${addWal.substring(0, 4)}...${addWal.substring(38)}`;
		
		if(wallet_address.classList.contains("exist")){
			wallet_address.addEventListener("click", ()=>{
				navigator.clipboard.writeText(localStorage.getItem("currentWallet"));
			})
		}

	}
}



addNewWallet.addEventListener("click", ()=>{
	render("addressBook", main_block, null);
	bottom_menu_items.forEach((item) => {
		item.classList.remove("active");
	})
	bottom_menu_items[3].classList.add("active");
})


bottom_menu_items.forEach((item) => {
	item.addEventListener("click", ()=>{
		if(!item.classList.contains("active")){
			render(item.getAttribute("data-id"), main_block, null);
		}

		bottom_menu_items.forEach((item) => {
			item.classList.remove("active");
		})
		item.classList.add("active");
	})
})

wallet_address.addEventListener("click", ()=>{
	wallet_address.classList.add("copied");
})

wallet_address.addEventListener("mouseover", ()=>{
	wallet_address.classList.remove("copied");
})


hamburger_icon.addEventListener("click", ()=>{
	sidebar.classList.toggle("show_sidebar");
	nav.classList.toggle("blur");
	content.classList.toggle("blur");
	bottom_menu.classList.toggle("blur");
	overlay.classList.toggle("show");

	const walletsList = document.getElementById("walletsList");
	var arrayOfWallets = JSON.parse(localStorage.getItem("walletsStorage"));

	walletsList.innerHTML = "";

	if(arrayOfWallets.length == 0){
		walletsList.innerHTML = `<span class="title">Your address book is empty</span>`;
	} else{
		var str = "";
		for(const wallet of arrayOfWallets){
			var checked = "";
			if(localStorage.getItem("currentWallet") == wallet.address){
				checked = `checked`;
			}
			str += `
				<li class="walletItem ${checked}" data-wallet="${wallet.address}" data-name="${wallet.name}">
					<div class="wallet">
						<span>${wallet.name}</span> (${wallet.address.substring(0, 4)}...${wallet.address.substring(38)})
					</div>
					<span class="checked"><i class="fa fa-check" aria-hidden="true"></i></span>
				</li>`;
		}
		walletsList.innerHTML += `<ul>${str}</ul>`;

		const walletItems = document.querySelectorAll(".walletItem");
		walletItems.forEach((item) => {
				item.addEventListener("click", ()=>{ 
					localStorage.setItem("currentWallet", item.getAttribute("data-wallet"));
					walletItems.forEach((item) => {
						item.classList.remove("checked");
					})
					item.classList.add("checked");

					sidebar.classList.toggle("show_sidebar");
					nav.classList.toggle("blur");
					content.classList.toggle("blur");
					bottom_menu.classList.toggle("blur");
					overlay.classList.toggle("show");

					wallet_address.innerHTML = `<span>${item.getAttribute("data-name")}</span> ${item.getAttribute("data-wallet").substring(0, 4)}...${item.getAttribute("data-wallet").substring(38)}`;

					tokenList = "";
					address = item.getAttribute("data-wallet");
					render("balance", main_block, null);

				}) 
		})

	}

})

overlay.addEventListener("click", ()=>{
	sidebar.classList.toggle("show_sidebar");
	nav.classList.toggle("blur");
	content.classList.toggle("blur");
	bottom_menu.classList.toggle("blur");
	overlay.classList.toggle("show");
})

close_sidebar.addEventListener("click", ()=>{
	sidebar.classList.toggle("show_sidebar");
	nav.classList.toggle("blur");
	content.classList.toggle("blur");
	bottom_menu.classList.toggle("blur");
	overlay.classList.toggle("show");
})


if(!localStorage.getItem('chainType') || !localStorage.getItem('chainID')){
	localStorage.setItem('chainID', 52);
	localStorage.setItem('chainType', "mainnet");
}

networkIndicator.className = "";
networkIndicator.classList.add(`chain_${localStorage.getItem('chainID')}`);
networkIndicator.classList.add(localStorage.getItem('chainType'));


const templates = {};

var tokenList = "";
var chainId = localStorage.getItem('chainID');
var address = localStorage.getItem("currentWallet");

const CSC_APIKEY = "61613a846b3b273647ad0651";

var nfts = {};
nfts.exist = false;
nfts.items = [];

if(!localStorage.getItem("currentWallet") || (localStorage.getItem("currentWallet") == "null") ){
	render("noWallet", main_block, "Balance");
}
else{
	;(async () => {
		result = await getTokenBalance(chainId, address, CSC_APIKEY, "balance",  -1);
		
		if (result.error) {
		    tokenList = `<li class="error"><p class="title">Error #${result.error_code}:</p><p class="subtitle">${result.error_message}</p></li>`;
		    listOfTokens.innerHTML = tokenList;
		}
		else{



			var balance = null;
			var realLogoUrl = null;
			if(result.data.items.length > 5){
				var maxToShow = 5;
				var showBtnMore = true;
			} else{
				var maxToShow = result.data.items.length;
				var showBtnMore = false;
			}

	  		for (var i = 0; i < maxToShow; i++){
				realLogoUrl = await checkIMG(result.data.items[i].contract_address, result.data.items[i].contract_ticker_symbol);

				let contract_address = `${result.data.items[i].contract_address.substring(0, 9)}...${result.data.items[i].contract_address.substring(33)}`;
				contract_address = `<p class="subtitle">Contract: ${contract_address}</p>`;

				tokenList += `<li class="token" data-tokenIMG="${realLogoUrl}"  data-tokenName="${result.data.items[i].contract_name} [${result.data.items[i].contract_ticker_symbol}]" data-tokenContract="${result.data.items[i].contract_address}">
					<img src="${realLogoUrl}" >
					<div>
						<p class="title">${result.data.items[i].contract_name}</p>
						${contract_address}
						<p class="subtitle">Balance: ${parseFloat(result.data.items[i].balance).toFixed(3).replace(/[.,]00$/, "")} ${result.data.items[i].contract_ticker_symbol}</p>
					</div>
					</li>`;
			}


			refreshAndSort.innerHTML = ` 
				<div id="refresh">
			        <span class="material-icons" style=" font-size: 22px; "> refresh </span> &nbsp;Refresh
		    </div>
	      	<div id="sort_block">
	        	<div id="sort">Sort by:</div>
	        	<div id="sortby">
		          	<ul>
			            <li class="sortOption" id="contract_name__1">Token name [a-z]</li>
			            <li class="sortOption" id="contract_name__-1">Token name [z-a]</li>
			            <li class="sortOption" id="balance__1">Token balance [asc]</li>
			            <li class="sortOption" id="balance__-1">Token balance [des]</li>
		          	</ul>
		        </div>
		    </div>`;
			listOfTokens.innerHTML = `${tokenList}`;
			if(result.data.items.length == 0){
				listOfTokens.innerHTML = `<li>
		    		<p class="title">No tokens</p>
		    	</li>`;
			}
			cet_total.innerHTML = `${parseFloat(result.cet_balance).toLocaleString()}`;

			
			refreshBtn = document.getElementById("refresh");
			refreshBtn.addEventListener("click", ()=>{
				render("refresh", main_block, null);
			});

			const sortOption = document.querySelectorAll(".sortOption");
			
			sortOption.forEach((item) => {
				item.addEventListener("click", ()=>{
					;(async () => {
						var sortBy = (item.id).split("__")[0];
						var sortAscDesc = parseInt((item.id).split("__")[1]);

						var sortedArray = await sortTokenBalance(result, sortBy, sortAscDesc);
						render("sortBalance", main_block, sortedArray);
					})()
					refreshAndSort.classList.add("hidden");
				})
			})

			if(showBtnMore){
				showMoreBlock = document.getElementById("showMoreBlock");
				showMoreBlock.innerHTML = `<button class="btn1" id="showMoreBtn">Show more</button>`;
				showMoreBtn = document.getElementById("showMoreBtn");
				showMoreBtn.addEventListener("click", function(event){
	        var targetElement = event.target || event.srcElement;
	        loadMore(targetElement, result);
	      });
			}
			
			tokenItemsOnClick();
		}
		
	})()



}




function loadMore(targetElement, sendedData){
	const listOfTokens = document.getElementById("listOfTokens");
	targetElement.classList.add("hidden");
	var tokensInList = document.getElementsByClassName("token").length;

	if(sendedData.data.items.length > tokensInList+5){
		var maxToShow = tokensInList + 5;
		var showBtnMore = true;
	} else{
		var maxToShow = sendedData.data.items.length;
		var showBtnMore = false;
	}

	;(async () => {
		var balance = null;
		for(var i=tokensInList; i < maxToShow; i++){
			realLogoUrl = await checkIMG(sendedData.data.items[i].contract_address, sendedData.data.items[i].contract_ticker_symbol);

			let contract_address = `${sendedData.data.items[i].contract_address.substring(0, 7)}...${sendedData.data.items[i].contract_address.substring(35)}`;
			contract_address = `<p class="subtitle">Contract: ${contract_address}</p>`;

			listOfTokens.innerHTML += `<li class="token" data-tokenIMG="${realLogoUrl}"  data-tokenName="${sendedData.data.items[i].contract_name} [${sendedData.data.items[i].contract_ticker_symbol}]" data-tokenContract="${sendedData.data.items[i].contract_address}">
				<img src="${realLogoUrl}" >
				<div>
					<p class="title">${sendedData.data.items[i].contract_name}</p>
					${contract_address}
					<p class="subtitle">Balance: ${parseFloat(sendedData.data.items[i].balance).toFixed(3).replace(/[.,]00$/, "")} ${sendedData.data.items[i].contract_ticker_symbol}</p>
				</div>
				</li>`;
		}
		
		if(showBtnMore){
			targetElement.classList.remove("hidden");
		}

		tokenItemsOnClick();

	})();
}


function loadMoreNFT(targetElement, sendedData){
	const listOfNFTs = document.getElementById("listNFT");
	targetElement.classList.add("hidden");
	var NftInList = document.getElementsByClassName("tokenNFT").length;

	if(sendedData.data.items.length > NftInList+5){
		var maxToShow = NftInList + 5;
		var showBtnMore = true;
	} else{
		var maxToShow = sendedData.data.items.length;
		var showBtnMore = false;
	}

	;(async () => {
		var balance = null;
		for(var i=NftInList; i < maxToShow; i++){
			listNFT.innerHTML += `
			<li class="tokenNFT">
				<img src="${resultNFTs.data.items[i].image}">
				<span class="title">${resultNFTs.data.items[i].name}</span><br>
				<span class="describtion">${resultNFTs.data.items[i].description}</span>
			</li>
			`;				
		}
		
		if(showBtnMore){
			targetElement.classList.remove("hidden");
		}

	})();
}

async function getTokenBalance(chainId, address, APIKEY, sort_by, asc_desc) {
	const url = new URL(`http://localhost:8080/http://www.coinex.net/api/v1/addresses/${address}/tokens`);

  	let response = await fetch(url, { method: 'GET', headers: { 
  		'Content-Type': 'text/plain', 
  		'apikey': APIKEY, 
  		'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token', 
  		'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS', 
  		'Access-Control-Allow-Origin': '*',
  		'origin': 'http://localhost:8080/',
  	}} );
    

  	let result = await response.json();

  	let returnedData;

  	if (result.code) {
	    returnedData = result; 
	}
	else{
		var newObject = {};
		newObject.data = {};
		newObject.data.items = []
		newObject.error = false;

		let temp_array = [];

		for(var i = 0; i < result.data.crc20.length; i++){
			if(result.data.crc20[i].balance != "0"){
				temp_array.push({
					"contract_address": result.data.crc20[i].token_info.contract.toLowerCase(),
					"contract_name": result.data.crc20[i].token_info.name,
					"contract_ticker_symbol": result.data.crc20[i].token_info.symbol,
					"balance": parseFloat(result.data.crc20[i].balance)
				});
			}
		}

		if(temp_array.length){
			if( typeof temp_array[0][sort_by] == "number"){
				newObject.data.items = Object.values(temp_array).sort(function(a, b) { 
					return (a[sort_by] - b[sort_by])*(asc_desc)
				});
			} 
			else if( typeof temp_array[0][sort_by] == "string"){
				if(asc_desc == 1){
					newObject.data.items = Object.values(temp_array).sort(function(a, b) { 
						return a[sort_by].localeCompare(b[sort_by]);
					});
				} else{
					newObject.data.items = Object.values(temp_array).sort(function(a, b) { 
						return b[sort_by].localeCompare(a[sort_by]);
					});
				}
			}
		}

		newObject.cet_balance = 0;

	  	response = await fetch(`http://localhost:8080/http://www.coinex.net/api/v1/addresses/${address}/balance`, { method: 'GET', headers: { 
	  		'Content-Type': 'text/plain', 
	  		'apikey': APIKEY, 
	  		'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token', 
	  		'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS', 
	  		'Access-Control-Allow-Origin': '*'
	  	}})

	  	result = await response.json();

	  	if (result.code == 0) {
		    newObject.cet_balance = parseFloat(result.data.balance).toFixed(4);
		}

		returnedData = newObject;

	}
  	return returnedData;
}

async function sortTokenBalance(result, sort_by, asc_desc){

	var newObject = {};
	newObject.data = {};
	newObject.cet_balance = result.cet_balance;
	newObject.error = false;

	if( typeof result.data.items[0][sort_by] == "number"){
		newObject.data.items = Object.values(result.data.items).sort(function(a, b) { 
			return (a[sort_by] - b[sort_by])*(asc_desc)
		});
	} 
	else if( result.data.items[0][sort_by] == null){
		newObject.data.items = Object.values(result.data.items).sort(function(a, b) { 
			return (a[sort_by] - b[sort_by])*(asc_desc)
		});
	} 
	else if( typeof result.data.items[0][sort_by] == "string"){


		if(sort_by == "balance"){
			newObject.data.items = Object.values(result.data.items).sort(function(a, b) { 
				if(a[sort_by] && b[sort_by] ){
					return ((Math.round(parseInt(a["balance"]) / 10**(a["contract_decimals"]) * 10000) / 10000) - (Math.round(parseInt(b["balance"]) / 10**(b["contract_decimals"]) * 10000) / 10000))*(asc_desc);
				}
			});
		} 
		else{
			if(asc_desc == 1){
				newObject.data.items = Object.values(result.data.items).sort(function(a, b) { 
					if(a[sort_by] && b[sort_by] ){
						return a[sort_by].trim().localeCompare(b[sort_by].trim());
					}
				});
			} else{
				newObject.data.items = Object.values(result.data.items).sort(function(a, b) { 
					return b[sort_by].trim().localeCompare(a[sort_by].trim());
				});
			}
		}
	}

	returnedData = newObject;
	return returnedData;
}


async function getNFTs(chainId, address, APIKEY){
	let url = new URL(`http://localhost:8080/http://www.coinex.net/api/v1/addresses/${address}/tokens`);

  	let response = await fetch(url, { method: 'GET', headers: { 
  		'Content-Type': 'text/plain', 
  		'apikey': APIKEY, 
  		'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token', 
  		'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS', 
  		'Access-Control-Allow-Origin': '*',
  	}} );
    
  	let result = await response.json();
  	let returnedData;

  	if (result.code) {
	    returnedData = result; 
	}
	else{

		var newObject = {};
		newObject.data = {};
		newObject.data.items = [];
		newObject.error = false;
		newObject.exist = false;

		const supportedCollection = "0x5f28235F6D98aaCBe28AE36aD85a3efCBF3A377c";

		if(result.data.crc721.length != 0){
			for(var i = 0; i < result.data.crc721.length; i++){
				if(result.data.crc721[i].token_info.contract.toLowerCase() == supportedCollection.toLowerCase()){
					if(result.data.crc721[i].balance != 0){
						newObject.exist = true;
					}
					break;
				}
			}
		}

		if(newObject.exist){
			let initialListOfIds = [];
	        let reallListOfIds = [];
	        let page = 1;

	        while(1){
	            let request = await getNftTokensIds(address, page, APIKEY);
	            let result = await request.json();

	            if(result.code == 0){
		            for(var j=0; j<result.data.records.length; j++){
		            	if(result.data.records[j].token_info.contract.toLowerCase() == supportedCollection.toLowerCase()){
			                if(result.data.records[j].to.address.toLowerCase() == address.toLowerCase() || result.data.records[j].from.address.toLowerCase() == address.toLowerCase()){
			                    initialListOfIds.push(result.data.records[j].token_id);
			                }
		            	}
		            }
	            }

	            if(result.data.has_next){
	                page ++;
	            } else{
	                break;
	            }
	        } 

	        let frequency = {};

	        for (const tokenId of initialListOfIds) {
	          frequency[tokenId] = frequency[tokenId] ? frequency[tokenId] + 1 : 1;
	        }

			for (const [key, value] of Object.entries(frequency)) {
	          	if(value % 2 == 1){
	          		reallListOfIds.push(key);
	          	}
	        }

	        let result = await getTokenMetadata(supportedCollection, reallListOfIds);

            if(result.length){
            	for(var i = 0; i < result.length; i++){
            		newObject.data.items.push({
                        "name": result[i].name,
                        "image": result[i].image,
                        "description": result[i].description,
                    })
            	}
            }
		}

		returnedData = newObject;
	}
  	return returnedData;
}


async function getNftTokensIds(address, page, APIKEY) {
    let url = new URL(`http://localhost:8080/http://www.coinex.net/api/v1/addresses/${address}/transfers/nft?page=${page}&limit=200`);

    let promise = fetch(url, { method: 'GET', headers: { 
  		'Content-Type': 'text/plain', 
  		'apikey': APIKEY, 
  		'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token', 
  		'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS', 
  		'Access-Control-Allow-Origin': '*',
  	}} );
    return promise;
}

async function getTokenMetadata(contract, arrayWithIds) {

	let web3 = new Web3();

	let abi = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":false,"internalType":"uint256","name":"level","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"summoner","type":"uint256"}],"name":"leveled","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":false,"internalType":"uint256","name":"class","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"summoner","type":"uint256"}],"name":"summoned","type":"event"},{"inputs":[{"internalType":"uint256","name":"_summoner","type":"uint256"}],"name":"adventure","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"adventurers_log","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"class","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"id","type":"uint256"}],"name":"classes","outputs":[{"internalType":"string","name":"description","type":"string"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"level","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_summoner","type":"uint256"}],"name":"level_up","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"next_summoner","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_summoner","type":"uint256"},{"internalType":"uint256","name":"_xp","type":"uint256"}],"name":"spend_xp","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_class","type":"uint256"}],"name":"summon","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_summoner","type":"uint256"}],"name":"summoner","outputs":[{"internalType":"uint256","name":"_xp","type":"uint256"},{"internalType":"uint256","name":"_log","type":"uint256"},{"internalType":"uint256","name":"_class","type":"uint256"},{"internalType":"uint256","name":"_level","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_summoner","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"xp","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"curent_level","type":"uint256"}],"name":"xp_required","outputs":[{"internalType":"uint256","name":"xp_to_next_level","type":"uint256"}],"stateMutability":"pure","type":"function"}];
  	let endPoint = 'https://rpc.coinex.net';

  	const provider = new Web3.providers.HttpProvider(endPoint);
    web3 = new Web3(provider);
  
  	addressOfContract = web3.utils.toChecksumAddress(contract);
  	Contract = new web3.eth.Contract(abi, addressOfContract)

  	let promises = [];
  	let promises_2 = [];

    arrayWithIds.map((tokenId) =>
        promises.push(Contract.methods.tokenURI(tokenId).call())
    );

    let arrayWithMetadatas = await Promise.all(promises);

  	arrayWithMetadatas.map((metadataURL) =>
        promises_2.push(fetch(metadataURL).then((response) => response.json()))
    );

    return Promise.all(promises_2);
}


function render(template_name, node, dataSended) {
		var listOfTokens = null;
		var refreshAndSort = null;
		var sortOption = null;
		var cet_total = null;
		var refreshBtn = null;

    if (!node) return;
    switch(template_name){
    	case "balance":

    		bottom_menu_items.forEach((item) => {
				item.classList.remove("active");
			})
			bottom_menu_items[0].classList.add("active");

    		if(!localStorage.getItem("currentWallet") || (localStorage.getItem("currentWallet") == "null") ){
    			render("noWallet", main_block, "Balance");
    			break;
    		}

    		node.innerHTML = `
    		<h1 class="title">Balance</h1>
    		<p id="balance_total"><span id="cet_total">-</span> CET</p>

    		<div id="refreshAndSort"></div>

    		<div id="listBlock"> 
	    		<ul id="listOfTokens">
		    		<div class="lds-dual-ring">
		    		<div>
	    		</ul> 
    		</div>
    		<div id="showMoreBlock"></div>`;
	    	listOfTokens = document.getElementById("listOfTokens");
	    	refreshAndSort = document.getElementById("refreshAndSort");

	    	var tokenListNew = "";
			cet_total = document.getElementById("cet_total");


	    	if(!tokenList){

	    		;(async () => {
						result = await getTokenBalance(chainId, address, CSC_APIKEY, "balance",  -1);
						
						if (result.code) {
						    tokenList = `<li class="error"><p class="title">Error #${result.code}:</p><p class="subtitle">${result.message}</p></li>`;
						    listOfTokens.innerHTML = tokenList;
							cet_total.innerHTML = `${parseFloat(result.cet_balance).toLocaleString()}`;
						}
						else{

							tokenList = "";
							var balance = null;
							var realLogoUrl = null;

					  		if(result.data.items.length > 5){
								var maxToShow = 5;
								var showBtnMore = true;
							} else{
								var maxToShow = result.data.items.length;
								var showBtnMore = false;
							}

					  		for (var i = 0; i < maxToShow; i++){
								realLogoUrl = await checkIMG(result.data.items[i].contract_address, result.data.items[i].contract_ticker_symbol);

								let contract_address = `${result.data.items[i].contract_address.substring(0, 9)}...${result.data.items[i].contract_address.substring(33)}`;
								contract_address = `<p class="subtitle">Contract: ${contract_address}</p>`;

								tokenListNew += `<li class="token" data-tokenIMG="${realLogoUrl}"  data-tokenName="${result.data.items[i].contract_name} [${result.data.items[i].contract_ticker_symbol}]" data-tokenContract="${result.data.items[i].contract_address}">
									<img src="${realLogoUrl}" >
									<div>
										<p class="title">${result.data.items[i].contract_name}</p>
										${contract_address}
										<p class="subtitle">Balance: ${parseFloat(result.data.items[i].balance).toFixed(3).replace(/[.,]00$/, "")} ${result.data.items[i].contract_ticker_symbol}</p>
									</div>
									</li>`;
							}
							refreshAndSort.innerHTML = ` 
								<div id="refresh">
			            <span class="material-icons" style=" font-size: 22px; "> refresh </span> &nbsp;Refresh
			          </div>
			          <div id="sort_block">
			            <div id="sort">Sort by:</div>
			            <div id="sortby">
			              <ul>
			                <li class="sortOption" id="contract_name__1">Token name [a-z]</li>
			                <li class="sortOption" id="contract_name__-1">Token name [z-a]</li>
			                <li class="sortOption" id="balance__1">Token balance [asc]</li>
			                <li class="sortOption" id="balance__-1">Token balance [des]</li>
			              </ul>
			            </div>
			          </div>`;

							refreshBtn = document.getElementById("refresh");
							refreshBtn.addEventListener("click", ()=>{
								render("refresh", main_block, null);
							});

							refreshAndSort = document.getElementById("refreshAndSort");
				    	refreshAndSort.classList.remove("hidden");
				    	sortOption = document.querySelectorAll(".sortOption");
					
							sortOption.forEach((item) => {
								item.addEventListener("click", ()=>{
									;(async () => {
										var sortBy = (item.id).split("__")[0];
										var sortAscDesc = parseInt((item.id).split("__")[1]);

										var sortedArray = await sortTokenBalance(result, sortBy, sortAscDesc);

										render("sortBalance", main_block, sortedArray);
									})()
									refreshAndSort.classList.add("hidden");
								})
							})

							listOfTokens.innerHTML = `${tokenListNew}`;
							if(result.data.items.length == 0){
								listOfTokens.innerHTML = `<li>
						    		<p class="title">No tokens</p>
						    	</li>`;
							}

							cet_total.innerHTML = `${parseFloat(result.cet_balance).toLocaleString()}`;

							if(showBtnMore){
		    				showMoreBlock = document.getElementById("showMoreBlock");
								showMoreBlock.innerHTML = `<button class="btn1" id="showMoreBtn">Show more</button>`;
								showMoreBtn = document.getElementById("showMoreBtn");

								showMoreBtn.addEventListener("click", function(event){
					        var targetElement = event.target || event.srcElement;
					        loadMore(targetElement, result);
					      });
							}

						}

						tokenItemsOnClick();

					})()

	    	} else{
	    		refreshAndSort.innerHTML = ` 
						<div id="refresh">
	            <span class="material-icons" style=" font-size: 22px; "> refresh </span> &nbsp;Refresh
	          </div>
	          <div id="sort_block">
	            <div id="sort">Sort by:</div>
	            <div id="sortby">
	              <ul>
	                <li class="sortOption" id="contract_name__1">Token name [a-z]</li>
	                <li class="sortOption" id="contract_name__-1">Token name [z-a]</li>
	                <li class="sortOption" id="balance__1">Token balance [asc]</li>
	                <li class="sortOption" id="balance__-1">Token balance [des]</li>
	              </ul>
	            </div>
	          </div>`;

					refreshBtn = document.getElementById("refresh");
					refreshBtn.addEventListener("click", ()=>{
						render("refresh", main_block, null);
					});

	    		listOfTokens.innerHTML = `${tokenList}`;
	    		cet_total.innerHTML = `${parseFloat(result.cet_balance).toLocaleString()}`;

	    		if(result.data.items.length > 5){
						var maxToShow = 5;
						var showBtnMore = true;
					} else{
						var maxToShow = result.data.items.length;
						var showBtnMore = false;
					}

					if(showBtnMore){
		    		showMoreBlock = document.getElementById("showMoreBlock");
		    		showMoreBlock.innerHTML = `<button class="btn1" id="showMoreBtn">Show more</button>`;
						showMoreBtn = document.getElementById("showMoreBtn");

						showMoreBtn.addEventListener("click", function(event){
			        var targetElement = event.target || event.srcElement;
			        loadMore(targetElement, result);
			      });
					}

					tokenItemsOnClick();

	    	}


	    	refreshAndSort = document.getElementById("refreshAndSort");
	    	refreshAndSort.classList.remove("hidden");
	    	sortOption = document.querySelectorAll(".sortOption");
		
				sortOption.forEach((item) => {
					item.addEventListener("click", ()=>{
						;(async () => {
							var sortBy = (item.id).split("__")[0];
							var sortAscDesc = parseInt((item.id).split("__")[1]);
							var sortedArray = await sortTokenBalance(result, sortBy, sortAscDesc);
							render("sortBalance", main_block, sortedArray);
						})()
						refreshAndSort.classList.add("hidden");
					})
				})

    		break;

    	case "refresh":

    		if(!localStorage.getItem("currentWallet") || (localStorage.getItem("currentWallet") == "null") ){
    			render("noWallet", main_block, "Balance");
    			break;
    		}

    		node.innerHTML = `
    		<h1 class="title">Balance</h1>
    		<p id="balance_total"><span id="cet_total">-</span> CET</p>

    		<div id="refreshAndSort"></div>

    		<div id="listBlock"> 
	    		<ul id="listOfTokens">
		    		<div class="lds-dual-ring">
		    		<div>
	    		</ul> 
    		</div>
    		<div id="showMoreBlock"></div>`;
	    	listOfTokens = document.getElementById("listOfTokens");
	    	refreshAndSort = document.getElementById("refreshAndSort");

	    	var tokenListNew = "";
				cet_total = document.getElementById("cet_total");

    		;(async () => {
					result = await getTokenBalance(chainId, address, CSC_APIKEY, "balance",  -1);
					
					if (result.error) {
					    tokenList = `<li class="error"><p class="title">Error #${result.error_code}:</p><p class="subtitle">${result.error_message}</p></li>`;
					    listOfTokens.innerHTML = tokenList;
							cet_total.innerHTML = `${parseFloat(result.cet_balance).toLocaleString()}`;
					}
					else{
						tokenList = "";
						var balance = null;
						var realLogoUrl = null;

				  	if(result.data.items.length > 5){
							var maxToShow = 5;
							var showBtnMore = true;
						} else{
							var maxToShow = result.data.items.length;
							var showBtnMore = false;
						}

				  	for (var i = 0; i < maxToShow; i++){
							realLogoUrl = await checkIMG(result.data.items[i].contract_address, result.data.items[i].contract_ticker_symbol);

							let contract_address = `${result.data.items[i].contract_address.substring(0, 9)}...${result.data.items[i].contract_address.substring(33)}`;
							contract_address = `<p class="subtitle">Contract: ${contract_address}</p>`;

							tokenListNew += `<li class="token" data-tokenIMG="${realLogoUrl}"  data-tokenName="${result.data.items[i].contract_name} [${result.data.items[i].contract_ticker_symbol}]" data-tokenContract="${result.data.items[i].contract_address}">
								<img src="${realLogoUrl}" >
								<div>
									<p class="title">${result.data.items[i].contract_name}</p>
									${contract_address}
									<p class="subtitle">Balance: ${parseFloat(result.data.items[i].balance).toFixed(3).replace(/[.,]00$/, "")} ${result.data.items[i].contract_ticker_symbol}</p>
								</div>
								</li>`;
						}
						refreshAndSort.innerHTML = ` 
							<div id="refresh">
		            <span class="material-icons" style=" font-size: 22px; "> refresh </span> &nbsp;Refresh
		          </div>
		          <div id="sort_block">
		            <div id="sort">Sort by:</div>
		            <div id="sortby">
		              <ul>
		                <li class="sortOption" id="contract_name__1">Token name [a-z]</li>
		                <li class="sortOption" id="contract_name__-1">Token name [z-a]</li>
		                <li class="sortOption" id="balance__1">Token balance [asc]</li>
		                <li class="sortOption" id="balance__-1">Token balance [des]</li>
		              </ul>
		            </div>
		          </div>`;

						refreshBtn = document.getElementById("refresh");
						refreshBtn.addEventListener("click", ()=>{
							render("refresh", main_block, null);
						});

						refreshAndSort = document.getElementById("refreshAndSort");
			    	refreshAndSort.classList.remove("hidden");
			    	sortOption = document.querySelectorAll(".sortOption");
				
						sortOption.forEach((item) => {
							item.addEventListener("click", ()=>{
								;(async () => {
									var sortBy = (item.id).split("__")[0];
									var sortAscDesc = parseInt((item.id).split("__")[1]);
									var sortedArray = await sortTokenBalance(result, sortBy, sortAscDesc);
									render("sortBalance", main_block, sortedArray);
								})()
								refreshAndSort.classList.add("hidden");
							})
						})

						listOfTokens.innerHTML = `${tokenListNew}`;
						if(result.data.items.length == 0){
							listOfTokens.innerHTML = `<li>
					    		<p class="title">No tokens</p>
					    	</li>`;
						}


						cet_total.innerHTML = `${parseFloat(result.cet_balance).toLocaleString()}`;

						if(showBtnMore){
	    				showMoreBlock = document.getElementById("showMoreBlock");
							showMoreBlock.innerHTML = `<button class="btn1" id="showMoreBtn">Show more</button>`;
							showMoreBtn = document.getElementById("showMoreBtn");

							showMoreBtn.addEventListener("click", function(event){
				        var targetElement = event.target || event.srcElement;
				        loadMore(targetElement, result);
				      });
						}

					}

					tokenItemsOnClick();

				})()


	    	refreshAndSort = document.getElementById("refreshAndSort");
	    	refreshAndSort.classList.remove("hidden");
	    	sortOption = document.querySelectorAll(".sortOption");
		
				sortOption.forEach((item) => {
					item.addEventListener("click", ()=>{
						;(async () => {
							var sortBy = (item.id).split("__")[0];
							var sortAscDesc = parseInt((item.id).split("__")[1]);
							var sortedArray = await sortTokenBalance(result, sortBy, sortAscDesc);
							render("sortBalance", main_block, sortedArray);
						})()
						refreshAndSort.classList.add("hidden");
					})
				})

    		break;

    	case "sortBalance":

    		if(!localStorage.getItem("currentWallet") || (localStorage.getItem("currentWallet") == "null") ){
    			render("noWallet", main_block, "Balance");
    			break;
    		}

    		node.innerHTML = `
    		<h1 class="title">Balance</h1>
    		<p id="balance_total"><span id="cet_total">-</span> CET</p>

    		<div id="refreshAndSort"></div>

    		<div id="listBlock"> 
	    		<ul id="listOfTokens">
		    		<div class="lds-dual-ring">
		    		<div>
	    		</ul> 
    		</div>
    		<div id="showMoreBlock"></div>`;
	    	listOfTokens = document.getElementById("listOfTokens");
	    	refreshAndSort = document.getElementById("refreshAndSort");
				cet_total = document.getElementById("cet_total");

				;(async () => {
					refreshAndSort.classList.add("hidden");
	    		refreshAndSort.innerHTML = ` 
						<div id="refresh">
	            <span class="material-icons" style=" font-size: 22px; "> refresh </span> &nbsp;Refresh
	          </div>
	          <div id="sort_block">
	            <div id="sort">Sort by:</div>
	            <div id="sortby">
	              <ul>
	                <li class="sortOption" id="contract_name__1">Token name [a-z]</li>
	                <li class="sortOption" id="contract_name__-1">Token name [z-a]</li>
	                <li class="sortOption" id="balance__1">Token balance [asc]</li>
	                <li class="sortOption" id="balance__-1">Token balance [des]</li>
	              </ul>
	            </div>
	          </div>`;

					refreshBtn = document.getElementById("refresh");
					refreshBtn.addEventListener("click", ()=>{
						render("refresh", main_block, null);
					});

	    		if(dataSended.data.items.length > 5){
						var maxToShow = 5;
						var showBtnMore = true;
					} else{
						var maxToShow = dataSended.data.items.length;
						var showBtnMore = false;
					}

					tokenListNew = "";

					for (var i = 0; i < maxToShow; i++){
						realLogoUrl = await checkIMG(dataSended.data.items[i].contract_address, dataSended.data.items[i].contract_ticker_symbol);

						let contract_address = `${result.data.items[i].contract_address.substring(0, 9)}...${result.data.items[i].contract_address.substring(33)}`;
						contract_address = `<p class="subtitle">Contract: ${contract_address}</p>`;

						tokenListNew += `<li class="token" data-tokenIMG="${realLogoUrl}"  data-tokenName="${dataSended.data.items[i].contract_name} [${dataSended.data.items[i].contract_ticker_symbol}]" data-tokenContract="${dataSended.data.items[i].contract_address}">
							<img src="${realLogoUrl}" >
							<div>
								<p class="title">${dataSended.data.items[i].contract_name}</p>
								${contract_address}
								<p class="subtitle">Balance: ${parseFloat(dataSended.data.items[i].balance).toFixed(3).replace(/[.,]00$/, "")} ${dataSended.data.items[i].contract_ticker_symbol}</p>
							</div>
							</li>`;
					}

					listOfTokens.innerHTML = `${tokenListNew}`;
					cet_total.innerHTML = `${parseFloat(dataSended.cet_balance).toLocaleString()}`;

					if(showBtnMore){
		    		showMoreBlock = document.getElementById("showMoreBlock");
		    		showMoreBlock.innerHTML = `<button class="btn1" id="showMoreBtn">Show more</button>`;
						showMoreBtn = document.getElementById("showMoreBtn");

						showMoreBtn.addEventListener("click", function(event){
			        var targetElement = event.target || event.srcElement;
			        loadMore(targetElement, dataSended);
			      });
					}

					refreshAndSort.classList.remove("hidden");
					sortOption = document.querySelectorAll(".sortOption");
			
					sortOption.forEach((item) => {
						item.addEventListener("click", ()=>{
							;(async () => {
								var sortBy = (item.id).split("__")[0];
								var sortAscDesc = parseInt((item.id).split("__")[1]);
								var sortedArray = await sortTokenBalance(result, sortBy, sortAscDesc);
								render("sortBalance", main_block, sortedArray);
							})()
							refreshAndSort.classList.add("hidden");
						})
					})

					tokenItemsOnClick();

				})();

    		break;

    	case "tokenInfo":
    		node.innerHTML = `
    		<div class="undo"><span class="material-icons"> arrow_back </span></div>
    		<div class="token-logo"><img src="${dataSended.tokenIMG}"></div>
    		<h2 class="title">${dataSended.tokenName}</h2>

    		<div id="transactionsList"> 
    			<h2>Transactions:</h2>
    			<div class="lds-dual-ring"></div>
    		</div>
    		 `;

    			var back = document.getElementsByClassName("undo")[0];
    			back.addEventListener("click", ()=>{
					render("balance", main_block, null);
				})

				const transactionsList = document.getElementById("transactionsList");

				if(["", "0x7417e92923952a3d65bffab3f34d2bd77497c890"].includes(dataSended.tokenContract)){
					transactionsList.innerHTML = `
				    <div id="listBlock" style="margin-top:0px">
				    	<h2>Transactions:</h2>
				    	<ul>
				    	<li class="error">
				    		<p class="title">Error #501:</p>
				    		<p class="subtitle">Fetching transfers for CKB and WCKB tokens is not currently supported</p>
				    	</li>
				    	</ul>
				    </div> `;
				}
				else {
					;(async () => {
						resultTransactions = await getTransactions(chainId, address, dataSended.tokenContract, CSC_APIKEY);
						
						if (resultTransactions.error) {
						    transactionsList.innerHTML = `
						    <div id="listBlock" style=" margin-top: 0px; ">
							    <div id="allTransactions" style="margin-top:0px">
							    	<h2>Transactions:</h2>
							    	<ul>
							    	<li class="error">
							    		<p class="title">Error getTransactions:</p>
							    	</li>
							    	</ul>
							    </div>
							</div> `;					    
						}
						else{		

							if (!resultTransactions.existTransfers){
								transactionsList.innerHTML = `
								<div id="listBlock" style=" margin-top: 0px; ">
								    <div id="allTransactions" style="margin-top:0px">
								    	<h2>Transactions:</h2>
								    	<ul>
								    	<li>
								    		<p class="title">No transfers found</p>
								    	</li>
								    	</ul>
								    </div>
								</div>
								 `;
							}		
							else{
								transactionsList.innerHTML = `
								<div id="listBlock" style=" margin-top: 0px; ">
								    <div style="margin-top:0px">
								    	<h2>Transactions:</h2>
								    	<ul id="allTransactions">
								    	
								    	</ul>
								    </div>
								</div>
								 `;
								const allTransactions = document.getElementById("allTransactions");

								for(var id in resultTransactions.transfers){
									var timestamp = resultTransactions.transfers[id].block_signed_at;
									var date = new Date(timestamp); 
									var fomatedDate = date.getDate()+ "/"+(date.getMonth()+1)+ "/"+date.getFullYear()+ " "+date.getHours()+ ":"+date.getMinutes()+ ":"+date.getSeconds();
								
									allTransactions.innerHTML += `
									<li class="${resultTransactions.transfers[id].type}">
										<p><b>Date [UTC]:</b> ${fomatedDate}</p>
										<p><b>Tx Hash:</b> ${resultTransactions.transfers[id].tx_hash.substring(0, 9)}...${resultTransactions.transfers[id].tx_hash.substring(54)}</p>
										<p><b>From:</b> ${resultTransactions.transfers[id].from_address.substring(0, 9)}...${resultTransactions.transfers[id].from_address.substring(33)}</p>
										<p><b>To:</b> ${resultTransactions.transfers[id].to_address.substring(0, 9)}...${resultTransactions.transfers[id].to_address.substring(33)}</p>
										<p><b>Amount:</b> ${parseFloat(resultTransactions.transfers[id].value).toFixed(10).replace(/[.,]00$/, "")}</p>
										
									</li>
									 `;
								}							
							}		
						}
					})();
	    		}
    		break;

    	case "nfts":

    		if(!localStorage.getItem("currentWallet") || (localStorage.getItem("currentWallet") == "null") ){
    			render("noWallet", main_block, "NFT");
    			break;
    		}

    		node.innerHTML = `
    		<h1 class="title">NFT</h1>
    		<div id="listBlock" style="margin-top:0px"> 
    			<div class="lds-dual-ring"></div> 
    		</div>
    		<div id="blockForNFT"></div>
    		 `;

    		const blockForNFT = document.getElementById("blockForNFT");
	    	const listBlock = document.getElementById("listBlock");

	    	if(chainId != 52){
	    		listBlock.innerHTML = `
	    			<ul>
				    	<li class="error" >
				    		<p class="title" style=" font-weight: 400; ">This function is available now only for CoinEx Smart Chain Mainnet</p>
				    	</li>
			    	</ul> 
	    		`;
	    	} else{

	    		;(async () => {
						resultNFTs = await getNFTs(chainId, address, CSC_APIKEY);
						 
						if (resultNFTs.error) {
						    listBlock.innerHTML = `
						    <div id="listBlock" style="margin-top:0px">
						    	<ul>
						    	<li class="error NFT">
						    		<p class="title">Error</p>
						    	</li>
						    	</ul>
						    </div> `;					    
						}
						else{
							listBlock.innerHTML = `
			    			<ul>
						    	<li class="error NFT">
						    		<p class="title" style=" font-weight: 400; font-size: 15px;">Supported collections at the moment:<br><br> 
						    		- <a target="_blank" href="https://www.coinex.net/token/0x5f28235F6D98aaCBe28AE36aD85a3efCBF3A377c">Rarity Manifested [RM]</a>
						    	</li>
					    	</ul> 
			    		`;

			    		if(resultNFTs.data.items.length == 0){
			    			blockForNFT.innerHTML += `<span class="balanceNFT" style="font-size: 17px; color: white;">You don't have NFTs</span>`;
			    		}
			    		else{
			    			blockForNFT.innerHTML += `
			    				<span class="balanceNFT" style="font-size: 17px; color: white;">You have ${resultNFTs.data.items.length} NFTs</span>
			    				<div>
			    					<ul id="listNFT"></ul>
			    				</div>
			    				<div id="showMoreBlock"></div>
			    			`;
			    			var listNFT = document.getElementById("listNFT");

		    				if(resultNFTs.data.items.length > 5){
								var maxToShow = 5;
								var showBtnMore = true;
							} else{
								var maxToShow = resultNFTs.data.items.length;
								var showBtnMore = false;
							}

			    			for (var i = 0; i < maxToShow; i++){

								listNFT.innerHTML += `
									<li class="tokenNFT">
										<img src="${resultNFTs.data.items[i].image}">
										<span class="title">${resultNFTs.data.items[i].name}</span><br>
										<span class="describtion">${resultNFTs.data.items[i].description}</span>
									</li>
									`;
								}

								if(showBtnMore){
			    				showMoreBlock = document.getElementById("showMoreBlock");
									showMoreBlock.innerHTML = `<button class="btn1" id="showMoreBtn">Show more</button>`;
									showMoreBtn = document.getElementById("showMoreBtn");

									showMoreBtn.addEventListener("click", function(event){
						        var targetElement = event.target || event.srcElement;
						        loadMoreNFT(targetElement, resultNFTs);
						      });
								}

			    		}
		    		}
					})();
	    	}

    		break;

    	case "settings":
    		node.innerHTML = `
    			<h1 class="title">Settings</h1> 
    			<ul class="settings_options">
    				<li class="settingOption" data-id="addressBook"> <p class="title">Saved addresses</p> <p class="subtitle">View, edit or remove added addresses</p> </li> 
    				<li class="settingOption" data-id="network"> <p class="title">Change network</p> <p class="subtitle">Change your network settings</p> </li> 
    			</ul>
    			`;

    			const seetingOptions = document.querySelectorAll(".settingOption");

    			seetingOptions.forEach((item) => {
					item.addEventListener("click", ()=>{
						render(item.getAttribute("data-id"), main_block, null);
					})
				})

	    	break;

	    case "addressBook":
    		node.innerHTML = `
    		 	<div class="undo"><span class="material-icons"> arrow_back </span></div>
    			<h1 class="title">Saved addresses</h1>
    			<span id="addWalletBtn">Add new address</span>
    			<div id="addWalletForm" class="hidden">
    				<input id="walletName" type="text" maxlength="15" placeholder="Name"><br>
    				<input id="walletAddress" type="text" placeholder="Address"><br>
    				<p id="addError"></p>
    				<div class="btns">
	    				<button id="cancelAdd">Cancel</button>
	    				<button id="confirmAdd">Add</button>
    				</div>
    			</div>
    			<ul id="divAddressBook"></ul>
    		`;

    		var back = document.getElementsByClassName("undo")[0];
    		back.addEventListener("click", ()=>{
					render("settings", main_block, null);
				})

				var arrayOfWallets = JSON.parse(localStorage.getItem("walletsStorage"));
				var divAddressBook = document.getElementById("divAddressBook");

				divAddressBook.innerHTML = "";

				for(const wallet of arrayOfWallets){
					divAddressBook.innerHTML += ` 
	    		<li class="settingOption" data-id="${wallet.address}"> 
	    			<div class="row">
	    				<div class="left">
	    					<input type="text" class="input_title" value="${wallet.name}" maxlength="15" readonly data-id="${wallet.address}"> 
	    				</div>
	    				<div class="right">
		    				<span class="save hidden" data-id="${wallet.address}"><i class="fa fa-check" aria-hidden="true" ></i></span>
		    				<span class="edit" data-id="${wallet.address}"><i class="fa fa-pencil" aria-hidden="true"></i></span>
		    				<span class="delete" data-id="${wallet.address}"><i class="fa fa-trash" aria-hidden="true"></i></span>
		    			</div>
	    			</div>
	    			<p class="subtitle">${wallet.address}</p> 
	    		</li>
	    		`;
				}

				var addWalletBtn = document.getElementById("addWalletBtn");
				var addWalletForm = document.getElementById("addWalletForm");
				var cancelAdd = document.getElementById("cancelAdd");
				var confirmAdd = document.getElementById("confirmAdd");


				var walletName = document.getElementById("walletName");
				var walletAddress = document.getElementById("walletAddress");
				var addError = document.getElementById("addError");


				addWalletBtn.addEventListener("click", ()=>{
					addWalletForm.classList.toggle("hidden");
					walletName.value = "";
					walletAddress.value = "";
					addError.innerHTML = "";
					walletName.classList.remove("error");
					walletAddress.classList.remove("error");
				})

				cancelAdd.addEventListener("click", ()=>{
					addWalletForm.classList.toggle("hidden");
					walletName.value = "";
					walletAddress.value = "";
					addError.innerHTML = "";
					walletName.classList.remove("error");
					walletAddress.classList.remove("error");

					deleteBtns = document.querySelectorAll(".delete");
					editBtns = document.querySelectorAll(".edit"); 
	    		saveBtns = document.querySelectorAll(".save"); 

	    		editBtns.forEach((item) => {
						item.addEventListener("click", ()=>{
							document.querySelectorAll(`span.save[data-id='${item.getAttribute("data-id")}']`)[0].classList.remove("hidden");
							document.querySelectorAll(`input[data-id='${item.getAttribute("data-id")}']`)[0].readOnly = false;
							document.querySelectorAll(`input[data-id='${item.getAttribute("data-id")}']`)[0].classList.add("active");

							item.classList.add("hidden");
						})
					})

					saveBtns.forEach((item) => {
						item.addEventListener("click", ()=>{
							var walletInp = document.querySelectorAll(`input[data-id='${item.getAttribute("data-id")}']`)[0];
							if(walletInp.value){
								document.querySelectorAll(`span.edit[data-id='${item.getAttribute("data-id")}']`)[0].classList.remove("hidden");
								walletInp.setAttribute("value", walletInp.value);
								walletInp.readOnly = true;
								walletInp.classList.remove("active");

								var objIndex = arrayOfWallets.findIndex((obj => obj.address == item.getAttribute("data-id")));
								arrayOfWallets[objIndex].name = walletInp.value;
								localStorage.setItem("walletsStorage", JSON.stringify(arrayOfWallets));

								item.classList.add("hidden");

								var currentW = localStorage.getItem("currentWallet");
								if(item.getAttribute("data-id") == currentW){
									wallet_address.innerHTML = `<span>${walletInp.value}</span> ${item.getAttribute("data-id").substring(0, 4)}...${item.getAttribute("data-id").substring(38)}`;
								}

							} else{
								walletInp.focus();
							}
						})
					})

					deleteBtns.forEach((item) => {
						item.addEventListener("click", ()=>{
							document.querySelectorAll(`li.settingOption[data-id='${item.getAttribute("data-id")}']`).forEach((item) => { item.setAttribute("data-id", null); item.classList.add("hidden"); });
							document.querySelectorAll(`span.save[data-id='${item.getAttribute("data-id")}']`).forEach((item) => { item.setAttribute("data-id", null); });
							document.querySelectorAll(`input[data-id='${item.getAttribute("data-id")}']`).forEach((item) => { item.setAttribute("data-id", null); });							

							arrayOfWallets = arrayOfWallets.filter(e => e.address !== item.getAttribute("data-id"));
							localStorage.setItem("walletsStorage", JSON.stringify(arrayOfWallets));
							
							var currentW = localStorage.getItem("currentWallet");
							if( (item.getAttribute("data-id") == currentW) && arrayOfWallets.length){
								localStorage.setItem("currentWallet", JSON.parse(localStorage.getItem("walletsStorage"))[0].address);

								var indexOfWallet = JSON.parse(localStorage.getItem("walletsStorage")).findIndex((obj => obj.address == localStorage.getItem("currentWallet")));
								var nameWal = JSON.parse(localStorage.getItem("walletsStorage"))[indexOfWallet].name;
								var addWal = JSON.parse(localStorage.getItem("walletsStorage"))[indexOfWallet].address;
								wallet_address.classList.add("exist");
								wallet_address.innerHTML = `<span>${nameWal}</span> ${addWal.substring(0, 3)}...${addWal.substring(38)}`;
							
								if(wallet_address.classList.contains("exist")){
									wallet_address.addEventListener("click", ()=>{
										navigator.clipboard.writeText(localStorage.getItem("currentWallet"));
									})
								}

							}

							if(!arrayOfWallets.length){
								localStorage.setItem("currentWallet", null);

								wallet_address.classList.remove("exist");
								wallet_address.innerHTML = `<a id="addNewWallet">No wallet, click to add</a>`;

								addNewWallet = document.getElementById("addNewWallet");
								addNewWallet.addEventListener("click", ()=>{
									render("addressBook", main_block, null);
									bottom_menu_items.forEach((item) => {
										item.classList.remove("active");
									})
									bottom_menu_items[3].classList.add("active");
								})
							}

							tokenList = "";
							address = localStorage.getItem('currentWallet');

							arrayOfWallets = JSON.parse(localStorage.getItem("walletsStorage"));
							deleteBtns = document.querySelectorAll(".delete"); 
						})

					})
				})


				confirmAdd.addEventListener("click", ()=>{

					walletName = document.getElementById("walletName");
					walletAddress = document.getElementById("walletAddress");

					var validRegEx = /^0x([A-Fa-f0-9]{40})$/;
					var checkExist = arrayOfWallets.findIndex((obj => obj.address == walletAddress.value));

					if(!walletName.value){
						walletName.focus();
						addError.innerHTML = "Write a name of address";
						walletName.classList.add("error");
					} else if(!walletAddress.value || !(validRegEx.test(walletAddress.value)) ){
						walletName.classList.remove("error");
						addError.innerHTML = "Put an correct wallet address";
						walletAddress.focus();
						walletAddress.classList.add("error");
					} else if(checkExist >= 0){
						addError.innerHTML = "Wallet already exist in list !";
						walletAddress.focus();
						walletAddress.classList.add("error");
					} else{
						walletName.classList.remove("error");
						walletAddress.classList.remove("error");
						addError.innerHTML = "";

						arrayOfWallets.push({"name": walletName.value, "address":walletAddress.value});
						localStorage.setItem("walletsStorage", JSON.stringify(arrayOfWallets));

						if(arrayOfWallets.length == 1){
							localStorage.setItem("currentWallet", arrayOfWallets[0].address);

							var indexOfWallet = JSON.parse(localStorage.getItem("walletsStorage")).findIndex((obj => obj.address == localStorage.getItem("currentWallet")));
							var nameWal = JSON.parse(localStorage.getItem("walletsStorage"))[indexOfWallet].name;
							var addWal = JSON.parse(localStorage.getItem("walletsStorage"))[indexOfWallet].address;
							wallet_address.classList.add("exist");
							wallet_address.innerHTML = `<span>${nameWal}</span> ${addWal.substring(0, 3)}...${addWal.substring(38)}`;
							
							if(wallet_address.classList.contains("exist")){
								wallet_address.addEventListener("click", ()=>{
									navigator.clipboard.writeText(localStorage.getItem("currentWallet"));
								})
							}
						}

						divAddressBook.innerHTML += ` 
		    		<li class="settingOption" data-id="${walletAddress.value}"> 
		    			<div class="row">
		    				<div class="left">
		    					<input type="text" class="input_title" value="${walletName.value}" onfocus="this.value = this.value;" readonly data-id="${walletAddress.value}"> 
		    				</div>
		    				<div class="right">
			    				<span class="save hidden" data-id="${walletAddress.value}"><i class="fa fa-check" aria-hidden="true" ></i></span>
			    				<span class="edit" data-id="${walletAddress.value}"><i class="fa fa-pencil" aria-hidden="true"></i></span>
			    				<span class="delete" data-id="${walletAddress.value}"><i class="fa fa-trash" aria-hidden="true"></i></span>
			    			</div>
		    			</div>
		    			<p class="subtitle">${walletAddress.value}</p> 
		    		</li>
		    		`;

						addWalletForm.classList.toggle("hidden");

						deleteBtns = document.querySelectorAll(".delete"); 
						editBtns = document.querySelectorAll(".edit"); 
		    		saveBtns = document.querySelectorAll(".save"); 

		    		editBtns.forEach((item) => {
							item.addEventListener("click", ()=>{
								document.querySelectorAll(`span.save[data-id='${item.getAttribute("data-id")}']`)[0].classList.remove("hidden");
								document.querySelectorAll(`input[data-id='${item.getAttribute("data-id")}']`)[0].readOnly = false;
								document.querySelectorAll(`input[data-id='${item.getAttribute("data-id")}']`)[0].classList.add("active");

								item.classList.add("hidden");
							})
						})

						saveBtns.forEach((item) => {
							item.addEventListener("click", ()=>{
								var walletInp = document.querySelectorAll(`input[data-id='${item.getAttribute("data-id")}']`)[0];
								if(walletInp.value){
									document.querySelectorAll(`span.edit[data-id='${item.getAttribute("data-id")}']`)[0].classList.remove("hidden");
									walletInp.setAttribute("value", walletInp.value);
									walletInp.readOnly = true;
									walletInp.classList.remove("active");

									var objIndex = arrayOfWallets.findIndex((obj => obj.address == item.getAttribute("data-id")));
									arrayOfWallets[objIndex].name = walletInp.value;
									localStorage.setItem("walletsStorage", JSON.stringify(arrayOfWallets));

									item.classList.add("hidden");

									var currentW = localStorage.getItem("currentWallet");
									if(item.getAttribute("data-id") == currentW){
										wallet_address.innerHTML = `<span>${walletInp.value}</span> ${item.getAttribute("data-id").substring(0, 4)}...${item.getAttribute("data-id").substring(38)}`;
									}

								} else{
									walletInp.focus();
								}
							})
						})

						deleteBtns.forEach((item) => {
							item.addEventListener("click", ()=>{
								document.querySelectorAll(`li.settingOption[data-id='${item.getAttribute("data-id")}']`).forEach((item) => { item.setAttribute("data-id", null); item.classList.add("hidden"); });
								document.querySelectorAll(`span.save[data-id='${item.getAttribute("data-id")}']`).forEach((item) => { item.setAttribute("data-id", null); });
								document.querySelectorAll(`input[data-id='${item.getAttribute("data-id")}']`).forEach((item) => { item.setAttribute("data-id", null); });

								arrayOfWallets = arrayOfWallets.filter(e => e.address !== item.getAttribute("data-id"));
								localStorage.setItem("walletsStorage", JSON.stringify(arrayOfWallets));
								
								var currentW = localStorage.getItem("currentWallet");
								if( (item.getAttribute("data-id") == currentW) && arrayOfWallets.length){
									localStorage.setItem("currentWallet", JSON.parse(localStorage.getItem("walletsStorage"))[0].address);

									var indexOfWallet = JSON.parse(localStorage.getItem("walletsStorage")).findIndex((obj => obj.address == localStorage.getItem("currentWallet")));
									var nameWal = JSON.parse(localStorage.getItem("walletsStorage"))[indexOfWallet].name;
									var addWal = JSON.parse(localStorage.getItem("walletsStorage"))[indexOfWallet].address;
									wallet_address.classList.add("exist");
									wallet_address.innerHTML = `<span>${nameWal}</span> ${addWal.substring(0, 3)}...${addWal.substring(38)}`;
								
									if(wallet_address.classList.contains("exist")){
										wallet_address.addEventListener("click", ()=>{
											navigator.clipboard.writeText(localStorage.getItem("currentWallet"));
										})
									}

								}

								if(!arrayOfWallets.length){
									localStorage.setItem("currentWallet", null);

									wallet_address.classList.remove("exist");
									wallet_address.innerHTML = `<a id="addNewWallet">No wallet, click to add</a>`;

									addNewWallet = document.getElementById("addNewWallet");
									addNewWallet.addEventListener("click", ()=>{
										render("addressBook", main_block, null);
										bottom_menu_items.forEach((item) => {
											item.classList.remove("active");
										})
										bottom_menu_items[3].classList.add("active");
									})
								}

								tokenList = "";
								address = localStorage.getItem('currentWallet');

								arrayOfWallets = JSON.parse(localStorage.getItem("walletsStorage"));
								deleteBtns = document.querySelectorAll(".delete"); 
							})

						})

					tokenList = "";
					address = localStorage.getItem('currentWallet');


					}
				})

				
    		

    		var walletsNames = document.querySelectorAll(".input_title");

    		var editBtns = document.querySelectorAll(".edit");
    		var deleteBtns = document.querySelectorAll(".delete");
    		var saveBtns = document.querySelectorAll(".save");

    		editBtns.forEach((item) => {
					item.addEventListener("click", ()=>{
						document.querySelectorAll(`span.save[data-id='${item.getAttribute("data-id")}']`)[0].classList.remove("hidden");
						document.querySelectorAll(`input[data-id='${item.getAttribute("data-id")}']`)[0].readOnly = false;
						document.querySelectorAll(`input[data-id='${item.getAttribute("data-id")}']`)[0].classList.add("active");

						item.classList.add("hidden");
					})
				})

				saveBtns.forEach((item) => {
					item.addEventListener("click", ()=>{
						var walletInp = document.querySelectorAll(`input[data-id='${item.getAttribute("data-id")}']`)[0];
						if(walletInp.value){
							document.querySelectorAll(`span.edit[data-id='${item.getAttribute("data-id")}']`)[0].classList.remove("hidden");
							walletInp.setAttribute("value", walletInp.value);
							walletInp.readOnly = true;
							walletInp.classList.remove("active");

							var objIndex = arrayOfWallets.findIndex((obj => obj.address == item.getAttribute("data-id")));
							arrayOfWallets[objIndex].name = walletInp.value;
							localStorage.setItem("walletsStorage", JSON.stringify(arrayOfWallets));

							item.classList.add("hidden");

							var currentW = localStorage.getItem("currentWallet");
							if(item.getAttribute("data-id") == currentW){
								wallet_address.innerHTML = `<span>${walletInp.value}</span> ${item.getAttribute("data-id").substring(0, 4)}...${item.getAttribute("data-id").substring(38)}`;
							}

						} else{
							walletInp.focus();
						}
					})
				})

				deleteBtns.forEach((item) => {
					item.addEventListener("click", ()=>{
						document.querySelectorAll(`li.settingOption[data-id='${item.getAttribute("data-id")}']`).forEach((item) => { item.setAttribute("data-id", null); item.classList.add("hidden"); });
						document.querySelectorAll(`span.save[data-id='${item.getAttribute("data-id")}']`).forEach((item) => { item.setAttribute("data-id", null); });
						document.querySelectorAll(`input[data-id='${item.getAttribute("data-id")}']`).forEach((item) => { item.setAttribute("data-id", null); });

						arrayOfWallets = arrayOfWallets.filter(e => e.address !== item.getAttribute("data-id"));
						localStorage.setItem("walletsStorage", JSON.stringify(arrayOfWallets));

						var currentW = localStorage.getItem("currentWallet");
						if( (item.getAttribute("data-id") == currentW) && arrayOfWallets.length){
							localStorage.setItem("currentWallet", JSON.parse(localStorage.getItem("walletsStorage"))[0].address);
							
							var indexOfWallet = JSON.parse(localStorage.getItem("walletsStorage")).findIndex((obj => obj.address == localStorage.getItem("currentWallet")));
							var nameWal = JSON.parse(localStorage.getItem("walletsStorage"))[indexOfWallet].name;
							var addWal = JSON.parse(localStorage.getItem("walletsStorage"))[indexOfWallet].address;
							wallet_address.classList.add("exist");
							wallet_address.innerHTML = `<span>${nameWal}</span> ${addWal.substring(0, 3)}...${addWal.substring(38)}`;
								
						}

						if(!arrayOfWallets.length){
							localStorage.setItem("currentWallet", null);

							wallet_address.classList.remove("exist");
							wallet_address.innerHTML = `<a id="addNewWallet">No wallet, click to add</a>`;

							addNewWallet = document.getElementById("addNewWallet");
							addNewWallet.addEventListener("click", ()=>{
								render("addressBook", main_block, null);
								bottom_menu_items.forEach((item) => {
									item.classList.remove("active");
								})
								bottom_menu_items[3].classList.add("active");
							})
						}

						tokenList = "";
						address = localStorage.getItem('currentWallet');

						arrayOfWallets = JSON.parse(localStorage.getItem("walletsStorage"));
						deleteBtns = document.querySelectorAll(".delete"); 

					})
				})


	    	break;

    	case "network":
    		node.innerHTML = `
    		 	<div class="undo"><span class="material-icons"> arrow_back </span></div>
    			<h1 class="title">Change network</h1>
    			<p>More networks to be added soon...</p>
    			<ul id="networks"></ul>
    			`;
    		var back = document.getElementsByClassName("undo")[0];
    		back.addEventListener("click", ()=>{
				render("settings", main_block, null);
			})

    		var divNetworks = document.getElementById("networks");
    		divNetworks.innerHTML = "";

    		for(const chain of chains){
    			var active = "";
    			if(chain.id == localStorage.getItem('chainID')){
    				active = "active";
    			}
    			divNetworks.innerHTML += ` 
	    			<li class="network ${active}" data-id="${chain.id}" data-type="${chain.type}">${chain.title}</li>
	    		`;
    		}
    		

    		var allNetworks = document.querySelectorAll(".network");
    		allNetworks.forEach((item) => {
				item.addEventListener("click", ()=>{

					localStorage.setItem('chainID', item.getAttribute("data-id"));
					localStorage.setItem('chainType', item.getAttribute("data-type"));

					networkIndicator.className = "";
					networkIndicator.classList.add(`chain_${item.getAttribute("data-id")}`);
					networkIndicator.classList.add(item.getAttribute("data-type"));

				
					allNetworks.forEach((item) => {
						item.classList.remove("active");
					})
					item.classList.add("active");

					tokenList = "";
					chainId = localStorage.getItem('chainID');

				})
			})



	    	break;

    	case "noWallet":
    		node.innerHTML = `
    			<h1 class="title">${dataSended}</h1>
    			<div class="noWallet">
    				Your address book is empty.<br>
    				<a id="linkAddWallet">Click here to add new wallet</a>
    				</div>
    			`;

    		document.getElementById("linkAddWallet").addEventListener("click", ()=>{
    			render("addressBook", main_block, null);
    			bottom_menu_items.forEach((item) => {
						item.classList.remove("active");
					})
					bottom_menu_items[3].classList.add("active");
    		});

	    	break;

    	default:
    		node.innerHTML = templates[template_name];
    }
};

async function checkIMG(contract, ticker) {
  	if(localStorage.getItem('chainID') == 52){
  		const contract_list = 
	  		[
	  			"0X1D7C98750A47762FA8B45C6E3744AC6704F44698",
	  			"0X9F4165009E93B7F5BA61A477AD08CD3D1AD8AA36",
	  			"0X398DCA951CD4FC18264D995DCD171AA5DEBDA129",
	  			"0XD482E9FC49FA4D5CD2229FC4C443C7F77B68C518",
	  			"0XE6F8988D30614AFE4F7124B76477ADD79C665822",
	  			"0XF335B2440E62A953A42865ADF7BD73F4C6671A7B"
	  		]

  		if(contract_list.includes(contract.toUpperCase())){
  			return `resources/images/coinExTokens/${contract}.png`;
  		}
  		else{
  			return `https://eu.ui-avatars.com/api/?name=${ticker[0]}`;
  		}
  	}

}

function tokenItemsOnClick(){
	var tokenItems = document.querySelectorAll(".token");
	tokenItems.forEach((item) => {
		item.addEventListener("click", ()=>{
			var infoToken = {};
			infoToken.tokenIMG = item.getAttribute("data-tokenIMG");
			infoToken.tokenName = item.getAttribute("data-tokenName");
			infoToken.tokenContract = item.getAttribute("data-tokenContract");

			render("tokenInfo", main_block, infoToken);
			document.getElementsByClassName("item")[0].classList.remove("active");
		})
	})
}




async function getTransactions(chainID, address, contract, APIKEY){

	var newObject = {};
	newObject.transfers = [];
	newObject.error = false;
	newObject.existTransfers = false

    let page = 1;

    while(1){
    	let url = new URL(`http://localhost:8080/http://www.coinex.net/api/v1/addresses/${address}/transfers/token?page=${page}&limit=200`);

	    let request = await fetch(url, { method: 'GET', headers: { 
	  		'Content-Type': 'text/plain', 
	  		'apikey': APIKEY, 
	  		'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token', 
	  		'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS', 
	  		'Access-Control-Allow-Origin': '*',
	  	}} );

        let result = await request.json();

        if(result.code == 0){
            for(var j=0; j<result.data.records.length; j++){
            	if(result.data.records[j].token_info.contract.toLowerCase() == contract.toLowerCase()){
            		let type;
	                if(result.data.records[j].to.address.toLowerCase() == address.toLowerCase()){
	                	type = "IN";
	                } else if(result.data.records[j].from.address.toLowerCase() == address.toLowerCase()){
	                	type = "OUT";
	                }
	                    
                    newObject.transfers.push({
						"block_signed_at" : result.data.records[j].timestamp,
						"tx_hash" : result.data.records[j].tx_hash,
                    	"value": result.data.records[j].amount,
                    	"type": type,
                    	"from_address": result.data.records[j].from.address,
                    	"to_address": result.data.records[j].to.address,
                    });
                }
        	}
        }

        if(result.data.has_next){
            page ++;
        } else{
            break;
        }
    } 

    if(newObject.transfers.length){
    	newObject.existTransfers = true;
    }

	returnedData = newObject;
	

  return returnedData;
}