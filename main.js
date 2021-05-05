let alCargar = ()=>{
    incomeTotal()
    outcomeTotal()
    //sumExpenses()
    //restExpenses()
    setTimeout(totalExpenses,60)
    
    
}


//insert function




const bulkcreate = (dbtable, data)=>{
    let flag = empty(data);
    if(flag){
        dbtable.bulkAdd([data])
        console.log('data inserted successfuly!') 

    }else{
        console.log('wrong data, please provide well...')
    }
    return flag;
}

//check box validation

const empty = object=>{

    let flag =  false;

    for(const value in object){
        if(object[value] !="" && object.hasOwnProperty(value)){
        flag = true;
        }else{
            flag = false;
        }
    }
    return flag;
}

const expensesDb = (dbname, table)=>{
    //create database
    
    const db = new Dexie(dbname)
    db.version(1).stores(table)
    db.open()
    
    return db;
    }

let db = expensesDb('Expenses', {

        incomes: `++id, concept, amount, date`,
        outcomes: `++id, concept, amount, date` 
    })

//input tags

const expenseId = document.getElementById('ID');
const concept = document.getElementById('concept');
const amount = document.getElementById('amount');
const date = document.getElementById('date');
let form = document.forms['form'];
const type = form['tipo'];
//buttons
const btncreate = document.getElementById('btn-create');
const btnread = document.getElementById('btn-read');
const btnedit = document.getElementById('btn-edit');
const btndeleteall = document.getElementById('btn-delete-all');



//insert button inputs
btncreate.onclick = (event)=>    {

    if(type.value==='1'){
        let flag = bulkcreate(db.incomes,{
            concept: concept.value,
            amount: parseInt(amount.value)+0,
            date: date.value
        })
        console.log(flag)
        concept.value = amount.value = date.value = ""
        getData(db.incomes,(data)=>{
            expenseId.value = data.id +1 || 1;
        });
        let insertmsg = document.querySelector('.insertmsg')

        getMsg(flag, insertmsg)
    }else if(type.value==='2'){
        let flag = bulkcreate(db.outcomes,{
            concept: concept.value,
            amount: amount.value*(-1) ||null,
            date: date.value
        })
        //console.log(flag);
        concept.value = amount.value = date.value = ""
        getData(db.outcomes,(data)=>{
            expenseId.value = data.id +1 || 1;
        })
        let insertmsg = document.querySelector('.insertmsg')

        getMsg(flag, insertmsg);
    }else{console.log('ERROR, SPECIFY VALUE TYPE')}
    table()

    
    
}

//GET DATA FROM DATABASE
const getData = (dbtable,fn)=>{

    let index = 0;
    let obj = {};

    if(type.value==="1"){

        dbtable.count((count)=>{
            if(count){
                dbtable.each(table=>{
                        //console.log(table)
                        obj = Sortobj(table);
                        //console.log(obj);
                        fn(obj, index++);
                });
            }else{fn(0)}
    
        })
    }else if (type.value==='2'){
        dbtable.count((count)=>{
            if(count){
                dbtable.each(table=>{
                        //console.log(table)
                        obj = Sortobj(table);
                        //console.log(obj);
                        fn(obj, index++);
                });
            }else{fn(0)}
    
        })

    }else if(type.value==='3'){
        dbtable.count((count)=>{
            if(count){
                dbtable.each(table=>{
                        //console.log(table)
                        obj = Sortobj(table);
                        //console.log(obj);
                        fn(obj, index++);
                });
            }else{fn(0)}
    
        })   
    }//else{console.log('ERROR, SPECIFY TYPE OF AMOUNT')}
}

//THIS IS FOR SORT OBJECTS
const Sortobj = sortobj=>{
    let obj = {
        id: sortobj.id,
        concept: sortobj.concept,
        amount: sortobj.amount,
        date: sortobj.date
    }
    return obj;
}

//create event on read button

btnread.onclick = table;

//update(edit) event

btnedit.onclick=()=>{               //THIS TAKES THE DATA FROM THE FORM AND UPDATES THE DATABASE
    const id = parseInt(expenseId.value || 0)
    const amountClick = amount.value
    console.log(amountClick)
    if(amountClick>=0){
        if(id){
            db.incomes.update(id, {
                concept: concept.value,
                amount: amount.value,
                date: date.value
            }).then((updated)=>{
                //let get = updated?`Data Incomes UPDATED..!!`: `Couldn't Update DATA`
                get=updated?true:false;
                let updatemsg = document.querySelector('.updatemsg')
                getMsg(get, updatemsg)
                
            })

        }
    }else if(amountClick<0||null||string){
        if(id){
            db.outcomes.update(id, {
                concept: concept.value,
                amount: amount.value,
                date: date.value
            }).then((updated)=>{
                //let get = updated?`Data Outcomes UPDATED..!!`: `Couldn't Update DATA`
                get=updated?true:false;
                let updatemsg = document.querySelector('.updatemsg')
                getMsg(get, updatemsg)
            })

        }
    }
    table() 
}


const createEle = (tagname,appendTo,fn)=>{      // FUNCTION TO CREATE HTML ELEMENTS DINAMYCLY
    const element = document.createElement(tagname);
    if(appendTo)appendTo.appendChild(element);
    if(fn)fn(element);

}
function table(){       // FUNCTION TO CREATE HTML ELEMENTS DINAMYCLY
    const tbody = document.getElementById('tbody')
    const tbody2 = document.getElementById('tbody2')
    incomeTotal()
    

    while(tbody.hasChildNodes()){
        tbody.removeChild(tbody.firstChild) 
        
    }
    while(tbody2.hasChildNodes()){
        tbody2.removeChild(tbody2.firstChild) 
        
    }
    
    if(type.value==='1'){
        getData(db.incomes,(data)=>{

            if(data){
                createEle('tr',tbody,tr=>{


                    for (const value in data) {
                    
                        createEle('td', tr, td=>{
                            td.textContent =data.amount ===data[value]?`$ ${data[value]}`: data[value];
                            
                            
                        })
                    }
                    createEle('td', tr, td=>{
                        createEle('i',td,i=>{
                            i.className+='fas fa-edit btnedit'
                            i.setAttribute(`data-id`, data.id)
                            i.setAttribute(`data-amount`, data.amount)                            
                            i.onclick = editbtn;
                        } )
                    })
                    createEle('td', tr, td=>{
                        createEle('i',td,i=>{
                            i.className+='fas fa-trash-alt btndelete'
                            i.setAttribute(`data-id`, data.id)
                            i.setAttribute(`data-amount`, data.amount)
                            i.onclick = deletebtn;
                        } )
                    })
                })
            }
        })
    }else if(type.value==='2'){
        getData(db.outcomes,(data)=>{

            if(data){
                createEle('tr',tbody2,tr=>{


                    for (const value in data) {
                    
                        createEle('td', tr, td=>{
                            td.textContent =data.amount ===data[value]?`$ ${data[value]}`: data[value];
                            
                            
                        })
                    }
                    createEle('td', tr, td=>{
                        createEle('i',td,i=>{
                            i.className+='fas fa-edit btnedit'
                            i.setAttribute(`data-id`, data.id)
                            i.setAttribute(`data-amount`, data.amount)
                            i.onclick = editbtn;
                        } )
                    })
                    createEle('td', tr, td=>{
                        createEle('i',td,i=>{
                            i.className+='fas fa-trash-alt btndelete'
                            i.setAttribute(`data-id`, data.id)
                            i.setAttribute(`data-amount`, data.amount)
                            i.onclick = deletebtnOut;
                        } )
                    })
                })
            }
        })
    }else if(type.value==='3'){


        getData(db.outcomes,(data)=>{

            if(data){
                createEle('tr',tbody2,tr=>{


                    for (const value in data) {
                    
                        createEle('td', tr, td=>{
                            td.textContent =data.amount ===data[value]?`$ ${data[value]}`: data[value];
                            
                        })
                    }
                    createEle('td', tr, td=>{
                        createEle('i',td,i=>{
                            i.className+='fas fa-edit btnedit'
                            i.setAttribute(`data-id`, data.id)
                            i.setAttribute(`data-amount`, data.amount)
                            i.onclick = editbtn;
                        } )
                    })
                    createEle('td', tr, td=>{
                        createEle('i',td,i=>{
                            i.className+='fas fa-trash-alt btndelete'
                            i.setAttribute(`data-id`, data.id)
                            i.setAttribute(`data-amount`, data.amount)
                            i.onclick = deletebtnOut;
                        } )
                    })
                })
            }
        })

        getData(db.incomes,(data)=>{

            if(data){
                createEle('tr',tbody,tr=>{


                    for (const value in data) {
                    
                        createEle('td', tr, td=>{
                            td.textContent =data.amount ===data[value]?`$ ${data[value]}`: data[value]; 
                            
                        })
                    }
                    createEle('td', tr, td=>{
                        createEle('i',td,i=>{
                            i.className+='fas fa-edit btnedit'
                            i.setAttribute(`data-id`, data.id)
                            i.setAttribute(`data-amount`, data.amount)
                            i.onclick = editbtn;
                        } )
                    })
                    createEle('td', tr, td=>{
                        createEle('i',td,i=>{
                            i.className+='fas fa-trash-alt btndelete'
                            i.setAttribute(`data-id`, data.id)
                            i.setAttribute(`data-amount`, data.amount)
                            i.onclick = deletebtn;
                        } )
                    })
                })
            }
        })
    }else if(document.getElementById(tbody.textContent=null)){
        console.log('ASDASD')
        notfound.textContent = 'No record found in the DB...!'
    }
    
}

function editbtn(event){            //FUNCTION TO TAKE THE DATA FROM THE TABLE TO THE FORM
    
    let id = parseInt(event.target.dataset.id);
    let amountEvent = event.target.dataset.amount
    

    
    if(amountEvent>=0){
    db.incomes.get(id, data=>{
        expenseId.value = data.id ||0;
        concept.value = data.concept || "";
        amount.value = data.amount || 0;
        date.value = data.date|| "";
        
        
    })
    }else if(amountEvent<0||String){
        db.outcomes.get(id, data=>{
            expenseId.value = data.id ||0;
            concept.value = data.concept || "";
            amount.value = data.amount || "";
            date.value = data.date|| "";
    
            
        })
        

    }
    
}




const incomeTotal = ()=>{       //THIS IS TO ADD THE INCOMES AND STORE IT IN THE HTML ELEMENT
    

    acumIncomes=0;
    
    
    getData(db.incomes, (data)=>{
        
        for (const value in data) {
        
        
            acumIncomes += parseInt(data.amount)
            document.getElementById('ingresos').innerHTML = acumIncomes
            //console.log(acumIncomes)
            
            
            return acumIncomes;
        }   
        
        
    })
    
}

const outcomeTotal = ()=>{      //THIS IS TO ADD THE EXPENSES AND STORE IT IN THE HTML ELEMENT

    
    acumOutcomes=0;
    acum = []
    getData(db.outcomes, (data)=>{

        for (const value in data) {
            
            acumOutcomes += parseInt(data.amount)
            document.getElementById('egresos').innerHTML = acumOutcomes
            //console.log(acumOutcomes)
            
            return acumOutcomes;
        }
        
    })
    
    
}




const totalExpenses = ()=>{         //THE ONLY WAY THAT I FOUND TO GET THE RESULTANT AMOUNT IN TOTAL EXPENSES

    
    acumPositive = document.getElementById('ingresos').innerHTML
    acumNegative = document.getElementById('egresos').innerHTML * (-1)
    console.log(typeof acumNegative)
    
    
    acumTotal = acumPositive - acumNegative
    
    
    
    
    document.getElementById('incomes').innerHTML = `$ ${acumTotal}`    
    
        
        
    
}




function deletebtn(event){      //FUNCTION TO DELETE A ROW IN A INCOME TABLE

    let id = parseInt(event.target.dataset.id)
    db.incomes.delete(id)
    table();
}
function deletebtnOut(event){           //FUNCTION TO DELETE A ROW IN A EXPENSE TABLE

    
        
    let id = parseInt(event.target.dataset.id)
    db.outcomes.delete(id)
    table();
}

btndeleteall.onclick = ()=>{    //WIPE ALL DB AND CREATE IT AGAIN

    db.delete() 
    db = expensesDb('Expenses', {

        incomes: `++id, concept, amount, date`,
        outcomes: `++id, concept, amount, date` 
    })
    db.open();
    table();
    
    let deletemsg = document.querySelector('.deletemsg')
    getMsg(true, deletemsg)
    
}

function getMsg(flag, element){

    if(flag){
        element.className+=" movedown";

        setTimeout(()=>{
            element.classList.forEach(classname => {
                classname == 'movedown'?undefined:element.classList.remove("movedown")
            }); 

        },4000);
    }
}
