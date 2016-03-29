$("#Bos_nbhdSelect, #Bos_openSpaceSelect, #activitiesSelect").prop("disabled", true)
$("#nbhdSelectionChoiceSetAll, #activitiesToggle").hide();
$("#nbhdSelectionChoiceSetAll-inactive, #activitiesToggle-inactive").show();
var count = $("#Bos_nbhdSelect :selected").length;
if (count >= 2) {
    $("#nbhdSelectionChoiceRemover").hide();
    $("#nbhdSelectionChoiceRemover-inactive").show();
} else {};

$("#Bos_nbhdSelect, #Bos_openSpaceSelect, #activitiesSelect").prop("disabled", false);
$("#nbhdSelectionChoiceSetAll, #activitiesToggle").show();
$("#nbhdSelectionChoiceSetAll-inactive, #activitiesToggle-inactive").hide();
if (count >= 2) {
    $("#nbhdSelectionChoiceRemover-inactive").hide();
    $("#nbhdSelectionChoiceRemover").show();
} else {};


/*! show/hide selection choice remover */
/*$("#nbhdSelectionChoiceRemover").hide();*/
$("#Bos_nbhdSelect").on("change", function(e) {
    var count = $("#Bos_nbhdSelect :selected").length;
    if (count == 1) {
        $(".select2-selection__rendered li:first-child").css("margin-left", 19 + "px"); /*$("#nbhdSelectionChoiceRemover").hide();*/
        $("#Bos_nbhdForm .select2-search__field").css("text-indent", 0 + "px")
    } else {
        if (count >= 2) {
            $(".select2-selection__rendered li:first-child").css("margin-left", 41 + "px"); /*$("#nbhdSelectionChoiceRemover").show();*/
            $("#Bos_nbhdForm .select2-search__field").css("text-indent", 0 + "px")
        } else { /*$("#nbhdSelectionChoiceRemover").hide();*/
            $("#Bos_nbhdForm .select2-search__field").css("text-indent", 19 + "px")
        }
    }
});