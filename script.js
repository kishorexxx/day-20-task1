
// api-url to get all breweries , max is 200
var apiURL = "https://api.openbrewerydb.org/breweries?per_page=200" 


   //Variables for pagination
       var array = [];
       var len =  0;
        var tableSize = 12; 
        var startRow = 1;
        var endRow = 0;
        var currPage = 1;
        var maxPage = 0; 
        var list = [];
        var resList = []; 
        var array_list = [];

//modal dialog box
var cncel_btn = document.querySelector('.modal-button');
cncel_btn.addEventListener('click',()=>{
    var modal = document.querySelector('.modal');
    modal.style.display = 'none';
});


async function fetchBreweryList(api){ 
    var getApiResp = await fetch(api);
    var getPromise = await getApiResp.json();
    console.log(getPromise);
    return getPromise;
} 

// CREATING CARDS 
function createCard(i){ 
    var cardWrap = document.createElement('div');
    cardWrap.classList.add('card') 
    cardWrap.style.width = "18rem"

    var hd1 = document.createElement('h5');
    hd1.classList.add('card-title') 
    hd1.innerText = i.name; 

    var hd2 = document.createElement('h6');
    hd2.innerText = "Type : "+ i.brewery_type;  

    var cardAddr = document.createElement('div');
    cardAddr.classList.add('card-addr') 

    var addrP = document.createElement('p'); 
    addrP.classList.add('card-text') 
    addrP.innerHTML = `${i.street}, ${i.city}, ${i.state}, <br> ${i.country}, ${i.postal_code} `; 

    var addrlink = document.createElement('a'); 
    
    if(i.website_url != null) {
        addrlink.setAttribute('href',i.website_url);
        addrlink.setAttribute('target', '_blank'); 
        addrlink.innerText = "Visit : "+ i.website_url;

    }
    
    else {
        addrlink.setAttribute('href',"#");
        addrlink.innerText = "website unavailable";
        addrlink.style.color = "grey";
        addrlink.style.textDecoration = "none"
    }
    //appending to Address Div
    cardAddr.append(addrP)
    cardAddr.append(addrlink) 
    
    //Appending to Card
    cardWrap.append(hd1)
    cardWrap.append(hd2)
    cardWrap.append(cardAddr) 
   
    //Appending card to parent
    var parent = document.querySelector('#card-parent')
    parent.append(cardWrap)
}

//Fetch all breweries (max is 200) 
async function breweryAPI(){
    try{
        var parent = document.querySelector('#card-parent') 
            parent.innerHTML = "";  
            // var search = document.querySelector('#search-term')
            // search.value = ""; 
           // var res = document.querySelector('#result-term')
            //res.value = ""; 
        list = await fetchBreweryList(apiURL); 
        
         array_list = list
        var result = document.querySelector('.result') 
            result.innerHTML = `<h4> ${list.length} breweries found </h4>`

         //creating pagination
         paginationButtons();
    }
    catch(err){
        console.log(err);
        var modal = document.querySelector('.modal')
        var modalmsg = document.querySelector('#modal-msg')
        modalmsg.innerHTML = "Error fetching brewery list <br>" + err;
        modal.style.display = 'block';
    }
}  

    
//CARD STRUCTURE 
    // <div class="card"  style="width: 18rem;">
    //               <h5 class="card-title">10 Barrel Brewing Co</h5> 
    //               <h6>Type: large</h6> 
    //             <div class= "card-addr">
    //               <p class="card-text">1501 E St, San Diego, California, 92101-6618</p>
    //               <a href="http://10barrel.com" class="btn btn-primary">http://10barrel.com</a>
    //             </div>
    //  </div>  

// find Brewery filter fetch data
    async function findbreweryAPI(apiBy,fil_value,search_term) {
            
        try {  
            list = await fetchBreweryList(apiBy);     
            var parent = document.querySelector('#card-parent') 
            parent.innerHTML = ""; 
            var res = document.querySelector('#result-term')
            res.value = ""; 
            var result = document.querySelector('.result') 
            result.innerHTML = `<h4> ${list.length} results found </h4>`
            array_list = list;  
            paginationButtons();
            
        }
        catch(err){
            console.log(err);
            var modal = document.querySelector('.modal')
            var modalmsg = document.querySelector('#modal-msg')
            modalmsg.innerHTML = `Error fetching brewery list for this ${fil_value} and ${search_term} <br> ${err}`;
            modal.style.display = 'block';
        }

    }

    
    // determines total pages required
    function paginationButtons(){ 
        array = array_list; 
        len =  array.length;
        startRow = 1;
        endRow = tableSize;
        currPage = 1;
        maxPage = Math.ceil(len/tableSize);
      //console.log("in pagination",maxPage,startRow,endRow,len);
        createButtons();  
    }

    //creates button for all the pages
    function createButtons() {
        var page_btn = document.querySelector("#page-btn");
        page_btn.innerHTML = "";

        for(i=1; i<=maxPage; i++){
          //  console.log("in create",i);
            var btn = document.createElement('button') 
            btn.setAttribute('id', `btn-${i}`)
            btn.setAttribute('onclick', "pageEvent(this)")
            btn.innerText = i; 
            page_btn.append(btn);            
        } 
        currentPage();
        
    }
    
   // gets and displays the current page
    function currentPage(){ 
        var tableSize = 12
        startRow = ((Number(currPage))-1) * Number(tableSize) + 1; 
        endRow = (startRow + Number(tableSize)) - 1; 
       // console.log(currPage,tableSize,startRow,endRow);
        if(endRow > len)
           endRow = len; 
        
         displayCard();
        var page_show = document.querySelector("#showing"); 
        if( len != 0)
        page_show.innerHTML = `${startRow} to ${endRow} of ${len} results`
        else
        page_show.innerHTML = ` ${len} results`;
        var selectPage = "#btn-"+currPage
        //console.log(selectPage)
        var selectedPage = document.querySelector(selectPage) 
        //console.log(selectedPage)  
        if(selectedPage != null)
        selectedPage.classList.add("active");
        
    }
    
    // called everytime user clicks on a page button
    function pageEvent(e){
        currPage = Number(e.innerText);
        tableSize = 12; 
        //console.log("button clicked");
        var prevSel = document.querySelector("#page-btn button[class='active']")
       // console.log(prevSel); 
       if(prevSel != null)
        prevSel.classList.remove("active");
        currentPage();
    } 


   // determines the data to be displayed for selected page
    function displayCard(){ 
        try{
        //console.log("calling card", currPage);
        var parent = document.querySelector('#card-parent') 
        parent.innerHTML = ""; 
        var start = startRow - 1;
        var end = endRow;
        for(let j=start; j<end; j++){
           // console.log("calling card", currPage, j, list[j]);
            createCard(array_list[j]); 
        }
        }
        catch(err){
            console.log("error writing card");
        }
        
    } 

    //form to filter the displayed results 
    var resform = document.querySelector('#filter-form');
    resform.addEventListener('submit',(e)=>{
        e.preventDefault(); 
        populateResult();

    }) 
    
    //reset value         
   
    function resetList(e){
        array_list = list;
       // var search = document.querySelector('#result-term')
            //search.value = "";  
        var result = document.querySelector('.result') 
        result.innerHTML = `<h4> ${array_list.length} results found </h4>`
        paginationButtons();
    }
   

    

 
    