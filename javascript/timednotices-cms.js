(function($) {

	$.entwine('ss.timednotices', function($){
		
		var noticeHTML,
			container,
			timeout
		;
		
		var updateNotices = function () {
			$.getJSON('timednotice/notices', function(data){
				if(data.length) {
					container.html('');
					$(data).each(function(){
						var entry = $("<div />")
							.addClass('message')
							.addClass(this.MessageType)
							.attr('data-id', this.ID)
							.html(this.Message)

                        var year = this.Created.slice(0,4);
                        var month = this.Created.slice(5,7);
                        var day = this.Created.slice(8,10);
                        var time = this.Created.slice(11,16);

                        var dateStr = day + '/' + month + '/' + year + ' at ' + time;

                        var notice_time = $('<p>' + dateStr + '</p>')
                            .addClass('notice-time')
						var snoozer = $('<div>Snooze for <a href="#" rel="15">15 mins</a>, <a href="#" rel="60">1 hour</a>, <a href="#" rel="1440">1 day</a>, <a href="#" rel="-1">done</a></div>')
							.addClass('notice-snoozer')

                        entry.append(snoozer);
						entry.append(notice_time);
						container.append(entry);
					
					});
					container.show();
					$('.has-panel .cms-content-header-info').css('top', container.outerHeight());
					$('.better-buttons-utils').css('top', container.outerHeight() + 5);
					$(window).trigger('resize');		
				}

				timeout = setTimeout(updateNotices, 30000);
			});
		}

		$('.cms-content-header').entwine({
			onmatch: function(){
				this.prepend($("<div />")
					.attr('id', 'timed-notices')
					.hide()
				);
			}
		});

		$('#timed-notices').entwine({
			onmatch: function(){
				container = this;
				
				if (timeout) {
					clearTimeout(timeout);
				}
				updateNotices();
			}
		});
		
		$('#timed-notices .message a').entwine({
			onclick: function (e) {
				// handle using CMS request instead of directly linking
				var href = $(this).attr('href');
				if (href.indexOf('admin/') >= 0) {
					href = $('base').attr('href') + href;
					var cmsCont = $('.cms-container');
					if(!cmsCont.entwine('.ss').loadPanel(href)) {
						return false;
					}
				}
			}
		})
		
		$('#timed-notices .notice-snoozer a').entwine({
			onclick: function (e) {
				e.preventDefault();
				var notice = $(this.closest('.message'));
				
				$.post('timednotice/snooze', {ID: notice.attr('data-id'), plus: $(this).attr('rel')}, function(data) {
					notice.remove();
					$('.has-panel .cms-content-header-info').css('top', container.outerHeight());
					$('.better-buttons-utils').css('top', container.outerHeight() + 5);
					$(window).trigger('resize');
				})
				return false;
			}
		})
	});

}(jQuery));
