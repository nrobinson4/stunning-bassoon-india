$(document).ready(function() {

    // Toggle password visibility
    function togglePassword() {
        const passwordInput = document.getElementById("password");
        if (passwordInput.type === "password") {
            passwordInput.type = "text";
        } else {
            passwordInput.type = "password";
        }
    }

    // Function to show/hide text area for Other gender
    function toggleOtherGender() {
        const otherGenderInput = $("#otherGenderInput");
        const otherRadio = $("#other");

        if (otherRadio.is(":checked")) {
            otherGenderInput.show();
        } else {
            otherGenderInput.hide();
        }
    }

    // Call the function when a radio button is changed
    $("input[name='gender']").change(toggleOtherGender);

    // Add event listener to "Show Password" checkbox
    $("#showPassword").click(function() {
        togglePassword();
    });

    // Function to load JSON data from file
    function loadJSON(callback) {
        $.getJSON("data.json", function(response) {
            callback(response);
        });
    }

    // Enforce digits-only for phone and SID
    $("#phone, #SID").on("input", function() {
        this.value = this.value.replace(/\D/g, '');
    });

    // Allow digits and dashes for credit card
    $("#creditCard").on("input", function() {
        this.value = this.value.replace(/[^\d-]/g, '');
    });

    // Clear form
    function clearForm() {
        document.getElementById("signupForm").reset();
        // Clear the output div as well
        $("#output").html("");
        // Empty and hide the subgroup dropdown
        $("#subgroup").empty().hide(); 
        $("#clanMembersText").hide();
    }

    // Populate subgroup dropdown based on selected clan
    function populateSubgroupDropdown(clan) {
        const subgroupDropdown = $("#subgroup");
        $("#subgroup").empty().show(); 
        $("#clanMembersText").show();
        // Clear previous options
        subgroupDropdown.empty();

        // Add default option
        subgroupDropdown.append('<option value="" disabled selected>Select a character</option>');

        // Populate options based on selected clan
        if (clan === "Gojo") {
            subgroupDropdown.append('<option id="Satoru" value="Satoru">Gojo Satoru</option>');
            subgroupDropdown.append('<option id="Yuta" value="Yuta">Yuta Okkotsu</option>');
        } else if (clan === "Zenin") {
            subgroupDropdown.append('<option id="Maki" value="Maki">Maki Zenin</option>');
            subgroupDropdown.append('<option id="Megumi" value="Megumi">Megumi Fushiguro</option>');
        } else if (clan === "Kamo") {
            subgroupDropdown.append('<option id="Yuji" value="Yuji">Itadori Yuji</option>');
            subgroupDropdown.append('<option id="Choso" value="Choso">Choso</option>');
        }

        // Show subgroup dropdown
        $("#subgroupDropdown").show();
    }

    // Populate subgroup dropdown based on selected clan
    $("#favMember").change(function() {
        const clan = $(this).val();
        populateSubgroupDropdown(clan);
    });

    // Fill form with JSON data
    $("#fillWithJsonData").click(function() {
        $.getJSON("data.json", function(userData) {
            $("#name").val(userData.name);
            $("input[name='gender'][value='" + userData.gender + "']").prop('checked', true);
            $("#phone").val(userData.phone);
            const formattedCreditCard = userData.creditCard.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, '$1-$2-$3-$4');
            $("#creditCard").val(formattedCreditCard);
            $("#SID").val(userData.SID);
            $("#email").val(userData.email);
            $("#datetime").val(userData.datetime.split('T')[0] + 'T' + userData.datetime.split('T')[1].slice(0, -3));
        
            // Populate clan dropdown
            $("#favMember").val(userData.clan);

            // Trigger change event to populate subgroup dropdown
            populateSubgroupDropdown(userData.clan);
            $("#subgroup").val(userData.subgroup);

            // Populate interests checkboxes
            userData.interests.forEach(interest => {
                const interestID = interest.replace(" ", "");
                const $checkbox = $("#" + interestID);

                if ($checkbox.length) {
                    $checkbox.prop("checked", true);
                }
            });

            // console.log("Form filled with JSON data:", userData);
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            console.error("Error loading JSON:", textStatus, errorThrown);
        });
    });

    // Submit form
    $("#signupForm").submit(function(event) {
        console.log("Form submitted!");
        event.preventDefault();
        // changes password input type back to password
        $("#password").attr("type", "password");

        // Get form values
        const name = $("#name").val();
        // getting the value of selected gender
        let gender = $("input[name='gender']:checked").val();

        if (gender === "other") {
            gender = $("#otherGenderInput").val();
        }
        const phone = $("#phone").val();
        const SID = $("#SID").val();
        const creditCard = $("#creditCard").val();
                
        const email = $("#email").val();
        const datetime = $("#datetime").val();
        const clan = $("#favMember").val();
        const subgroup = $("#subgroup").val();
        
        
        // Handle checkboxes
        const interests = [];
        if ($("#interestAlchemy").is(":checked")) interests.push($("#interestAlchemy").val());
        if ($("#interestAstrology").is(":checked")) interests.push($("#interestAstrology").val());
        if ($("#interestTarot").is(":checked")) interests.push($("#interestTarot").val());
        if ($("#Supernatural").is(":checked")) interests.push($("#Supernatural").val());
        if ($("#cursedObjects").is(":checked")) interests.push($("#cursedObjects").val());
        if ($("#theVoid").is(":checked")) interests.push($("#theVoid").val());

        // Log form values to console
        console.log("Name:", name);
        console.log("Gender:", gender);
        console.log("Phone:", phone);
        console.log("Credit Card:", creditCard);
        console.log("Super secret password entered");
        console.log("School ID:", SID);
        console.log("Email:", email);
        console.log("Date and Time:", datetime);
        console.log("Selected Clan:", clan);
        console.log("Selected Subgroup:", subgroup);
        console.log("Interests:", interests.join(', '));

        // Display output
        // $("#output").html(`
        //     <p>Name: ${name}</p>
        //     <p>Gender: ${gender}</p>
        //     <p>Phone: ${phone}</p>
        //     <p>Credit Card: ${creditCard}</p>
        //     <p>School ID: ${SID}</p>
        //     <p>Email: ${email}</p>
        //     <p>Date and Time: ${datetime}</p>
        //     <p>Favorite Character: ${subgroup}</p>
        //     <p>Interests: ${interests.join(', ')}</p>
        // `);
    });

    // Added event listener to clear button
    $("#clearButton").click(function() {
        clearForm();
    });
});