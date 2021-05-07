
var bseats = new Array();
var price;
function booked(id)
{   
    price = document.getElementById('pricet').innerText
    var ele = document.getElementById(id);
    if(bseats.indexOf(id)>=0)
    {
        bseats.splice(bseats.indexOf(id), 1);
        ele.classList.remove('booked'); 
    }
    else
    {
        bseats.push(id)
        ele.classList.add('booked');
    }
    price = price * bseats.length
    document.getElementById('pricec').innerHTML = price
}

function checkoutu()
{
    var data = {
        theater : document.getElementById('theatreName').innerText,
        seats: bseats,
        city: document.getElementById('cityName').innerText,
        movie: document.getElementById('movName').innerText,
        date: document.getElementById('select_date').value,
        price: price
    }
    if (bseats.length != 0 && data.date != "") {
        let curdate = new Date();
        let sdate = new Date(document.getElementById('select_date').value)
        if (sdate < curdate) {
            document.getElementById('model-body').innerText = "Please Select Proper date";
        } else {
            axios.post('/checkout', data).then(data => {
                document.getElementById('model-body').innerText = bseats.length + " tickets is booked. Please Check your mail";
            }).catch(err)
            {
                console.log(err);
            }
        }
    }else
    {
        document.getElementById('model-body').innerText = "Please select seats and date";
    }
}

