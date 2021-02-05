window.addEventListener("load", function(){
    var submitBtn = document.getElementById("submit");
    submitBtn.addEventListener("click" , submitForm);

    function submitForm(){
                
        if(citID.value === ""){           
           citIDError.innerHTML = "Please enter an application ID";
           citIDError.style.fontSize = "1em";
           citIDError.style.color = "red";        
        } else if (citID.value.length < 15) {
            citIDError.innerHTML = "Please enter a valid application ID";
            citIDError.style.fontSize = "1em";
            citIDError.style.color = "red"; 
        } else if (firstName.value == "") {
            swal("Application not found", "The application ID was not found in the database", "info")
            citIDError.innerHTML = "";
        }
        else {
            citIDError.innerHTML = "";
            result.style.display = "block"

            var steps = [
                {
                    element: "#status",
                    content: "Please select an application status from the availale options",
                    placement: 'bottom-start'
                },
                {
                    element: '#update',
                    content: "Once you have selected an application status, please select the Update button to update the database",
                    placement: 'top-start'
                }    
            ]
                var wt2 = new WebTour();
                wt2.setSteps(steps);
                wt2.start();
        }
    }

    
    $('.form-group').keypress(function (e) {
        if (e.which == 13) {
          $('#submit').click();
          return false;
        }
      });

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
                //let DOB = ui.item.DOB;
                //$('#DOB').val(DOB)
            }
        });
    });

    $(document).ready(function(){
    
        $('#update').on('click', editEvent);
        $('#firstName').attr('disabled', true);
        $('#lastName').attr('disabled', true);
        $('#email').attr('disabled', true);
        $('#phone').attr('disabled', true);
        $('#currentStatus').attr('disabled', true);
        $('#cancel').on('click', function() {
            window.open("index.html", "_self");
        } );
    });
    

    $('#status').change(function() {
        $("#status option:selected").attr('disabled','disabled')
        .siblings().removeAttr('disabled');
    })

    function editEvent(){
        var status = document.getElementById("status");
        var update = status.options[status.selectedIndex].text;

        if (currentStatus.value == update || update == "Please select an application status") {
            swal("Invalid action", "Application status has not been changed", "info")
        } else {
        $.ajax({
        url: '/update/' + id,
        type:'PUT',
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify({"applicationStatus": update}),
        }).done(function(){
        }).fail(function(response){
        console.log("Oops not working \n" );
        });
       
        swal({
            position: 'top-end',
            icon: 'success',    
            text: 'Application status was updated',
            buttons: false,
            timer: 1500
          })
    
        setTimeout(function() {
            window.open("index.html", "_self");
        }, 2000)

        }
    }

   var steps = [
       {
          content: "Thank you for visiting. Please click on \Next\" for a quick walkthrough of this page. You can complete the walkthrough by clicking \"Close\""
        }, {
          element: '#citID',
          content: "Please enter and select your Citizenship ID, which has been provided to you by Damien O'Regan.",
          placement: 'bottom-start'
        },
        {
            element: "#submit",
            content: "Once you have selected your Citizenship ID, please select the Search button",
            placement: 'top-start'
        }]

        var wt = new WebTour();
        wt.setSteps(steps);
        wt.start();

        
    $('#result').keypress(function (e) {
        if (e.which == 13) {
           $('#update').click();
           return false;
        }
    });
});




