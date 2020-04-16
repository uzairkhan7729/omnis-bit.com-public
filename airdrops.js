$(document).ready(function () {


  const icon_social = {
    "facebook": "/airdrop_images/social/facebook.png",
    "reddit": "/airdrop_images/social/reddit.png",
    "twitter": "/airdrop_images/social/twitter.png",
    "instagram": "/airdrop_images/social/instagram.png",
    "medium": "/airdrop_images/social/medium.png",
    "youtube": "/airdrop_images/social/youtube.png",
 };


   $.ajax("airdrops.json")
      .done(function (airdrops) {
         console.log(airdrops);

         window.hideModal = function () {
            console.log("Dismissing modal window.");
            console.log($("#modalWindow"));
            $('#modalWindow').remove();
            $('body').removeClass('modal-open');
            //modal-open class is added on body so it has to be removed
            $('.modal-backdrop').remove();
            //need to remove div with modal-backdrop class
         }

         function showModal(airdrop) {
     debugger;
            return function () {
				debugger;
               console.log(airdrop);
               const title = airdrop["name"] || "";
               const description = airdrop["details"] || airdrop["description"] || "";
               const logo = airdrop["logo"] || "";
               const steps = airdrop["steps"] || [];
               const rewards = airdrop["rewards"] || "";
               const end = airdrop["end"] || "";
               const website = airdrop["website"] || "";
               const googleform = airdrop["googleform"] || "";
               const socials = airdrop["socials"] || {};

               var html = '<div id="modalWindow" class="modal fade in" style="display:none;">';
               html += '<div class="modal-content">';
               html += '<div class="modal-header">';

               html += '<h4>' + title + '</h4>'
               html += '</div>';
               html += '<div class="modal-body">';
               html += '<div class="container">';
               html += '<button type="button" class="btn btn-sm btn-primary closebutton" data-dismiss="modal" aria-hidden="true" onClick="window.hideModal()">Close</button>'; // 

               //left side
               html += '<div class="">';
               html += '<img class="logo" src="' + logo + '"/>';
               html += '</div>';

               //right side
               html += '<div class="">';
               html += '<p><strong> Description: </strong>';
               html += description;
               html += '<p><strong> Requirements: </strong>';

               const keys = Object.keys(socials);
               for (let key of keys) {
                  const icon = icon_social[key];
                  if (icon) {
                     html += '<img class="socialicon" src="' + icon + '".>';
                  }
               }

               html += '<p><strong> Rewards: </strong>';
               html += rewards;
               html += '<p><strong> End: </strong>';
               html += end;
               html += '<p><strong> Official Website: </strong>';
               html += website;

               html += "<p>";
               html += '<p><strong> Steps: </strong>';

               html += "<ul>";
               for (let step of steps) {
                  html += "<li>" + step + "</li>";
               }
               html += "<ul>";


               html += '<p><p><p>';
               html += '<a class="btn btn-sm btn-success" href="' + googleform + '">Complete Form</a>';
               html += '</div>';


               html += '</div>';  // right side
               html += '</div>';  // container
               html += '</div>';  // body

               html += '<div class="modal-footer">';


               html += '<button type="button" class="btn btn-sm btn-primary closebutton" data-dismiss="modal" aria-hidden="true" onClick="window.hideModal()">Close</button>'; // 
               html += '</div>';  // footer
               html += '</div>';  // content
               html += '</div>';  // modalWindow
               $("#airdropModal").html(html);
               $("#modalWindow").modal();
            }
         }

         for (var i = 0; i < airdrops.length; i++) {
            var airdrop = airdrops[i];
            const socials = airdrop["socials"] || {};
            var newRow = $("<tr/>");
            var iconColumn = $('<td>')
               .append($('<img/>', {
                  src: airdrop["icon"]
               })
                  .addClass("tableIcon")
               );

            newRow.append(iconColumn);

            var nameColumn = $('<td>')
               .text(airdrop["name"]);
            newRow.append(nameColumn);

            var descriptionColumn = $('<td>')
               .text(airdrop["description"]);
            newRow.append(descriptionColumn);

            var endColumn = $('<td>')
               .text(airdrop["end"]);
            newRow.append(endColumn);

            var socialColumn = $('<td>');
            const keys = Object.keys(socials);
            for (let key of keys) {
               const icon = icon_social[key];
               if (icon) {
                  let field = $('<img/>', {
                     src: icon
                  })
                     .addClass("socialicon");
                  socialColumn.append(field);
               }
            }
            newRow.append(socialColumn);

            var rewardsColumn = $('<td>')
               .text(airdrop["rewards"]);
            newRow.append(rewardsColumn);

            var claimColumn = $('<td>')
               .append(
                  $('<button/>', {
                     text: 'Claim now',
                     on: {
                        click: showModal(airdrop)
                     }
                  })
                     .addClass("btn btn-success btn-sm")
               );

            newRow.append(claimColumn);

            $("#airdroptable > tbody").append(newRow);
         }

         $('#airdroptable').DataTable({
            "paging": false,
            "ordering": true,
            "info": false,
            "columnDefs": [
               { "orderable": false, "targets": [0, 2, 4, 6] },
               { "orderable": true, "targets": [1, 3, 5] },
               { "searchable": false, "targets": [0, 2, 3, 4, 5, 6] },
               { "searchable": true, "targets": [1] }

            ]
         });

      })
      .fail(function (xhr, textStatus, err) {
        console.log(err);
         console.log("Error getting airdrops data file.");
      });
});

