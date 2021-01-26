
window.addEventListener("load", function(){
    var submitBtn = document.getElementById("submit");
    submitBtn.addEventListener("click", submitForm);
    
    function submitForm(){
                
        if(citID.value === ""){           
           citIDError.innerHTML = "Please enter an application ID";
           citIDError.style.fontSize = "1em";
           citIDError.style.color = "red";        
        }
        else {
           result.style.display = "block"
        }
    }

    var id; 
$(document).ready(function() {
    $("#citID").autocomplete({
        source: async function(request, response) {
            let data = await fetch(`/search?citID=${request.term}`)
            .then(results => results.json())
            .then(results => results.map(result => {
                return { 
                    label: result.citID, 
                    id: result._id, 
                    fName: result.firstName,
                    lName: result.lastName,
                    email: result.email,
                    DOB: result.DOB,
                    status: result.applicationStatus,
                    number: result.phoneNumber
                };
            }));
            response(data);

        },
        minLenght: 2,
        select: async function(event, ui) {
            id = ui.item.id;
            let firstName = ui.item.fName;
            $('#firstName').val(firstName)
            let lastName = ui.item.lName;
            $('#lastName').val(lastName);
            let email = ui.item.email;
            $('#email').val(email);
            let number = ui.item.number;
            $('#phone').val(number);
            let status = ui.item.status;
            $('#currentStatus').val(status)
            let DOB = ui.item.DOB;
            // $('#DOB').val(DOB)
        }
    });
});

$(document).ready(function(){
$('.updateEvent').on('click', editEvent);
});


function editEvent(){
var status = document.getElementById("status");
var update = status.options[status.selectedIndex].text;

$.ajax({
url: '/update/' + id,
type:'PUT',
dataType: "json",
contentType: "application/json",
data: JSON.stringify({"applicationStatus": update}),
}).done(function(response){
    alert("Application status has been updated to: " + update)
    window.open("index.html", "_self")
}).fail(function(response){
console.log("Oops not working \n" );
});

}
});



