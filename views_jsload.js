Drupal.behaviors.views_jsload = function(context){
  if (Drupal.settings && Drupal.settings.views && Drupal.settings.views.ajaxViews) {
    $.each(Drupal.settings.views.ajaxViews, function(i, settings) {
      if (settings.view_dom_id) {
        var view = '.view-dom-id-' + settings.view_dom_id;
        if (!$(view).size()) {
          // Backward compatibility: if 'views-view.tpl.php' is old and doesn't
          // contain the 'view-dom-id-#' class, we fall back to the old way of
          // locating the view:
          view = '.view-id-' + settings.view_name + '.view-display-id-' + settings.view_display_id;
        }
        
        if ($(view).hasClass('views-jsload')){
          // fix this view's path to avoid further conflicts
          Drupal.settings.views.ajaxViews[i].view_path = 'views_jsload';
          
          // send normal viewData, along with random number to bypass varnish
          var viewData = { 'js': 1, 'dom_id': settings.view_dom_id, 'rand': Math.floor((Math.random()*1000000)+1) };
         
          var path_array = ['views_jsload',settings.view_name];
          if (settings.view_display_id){
            path_array.push(settings.view_display_id);
          }
          if (settings.view_args){
            // do args another day
            //path_array.push(settings.view_args);
          }
          var ajax_path = '/'+path_array.join('/');
          
          $.ajax({
            url: ajax_path,
            type: 'GET',
            data: viewData,
            success: function(response) {
              $(view + '.views-jsload').html($(response.view_html).html()).removeClass('views-jsload');
            },
            error: function(xhr) { },
            dataType: 'json'
          });
        }
      }
    });
  }
}
