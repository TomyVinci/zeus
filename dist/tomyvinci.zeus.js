/*
 *  https://github.com/TomyVinci/zeus
 *
 *  Document   : zeus.js
 *  Author     : Tomy Vinci 
 *  Description: The javascript file of zeus
 *  Version    : v1.0.0 / Free
 *
*/
var loads=0;
let zeusIntervalId = null;
let zeusIsKeyPressed = false;
let zeusKeyPressSpeed = 400;
let zeusPreselVal;
let zeusPreSelItem;
if (typeof jQuery != 'undefined') {
	(function($){
	    $.fn.tvzeus=function(b){
			/*==============
			// Options
			====================*/
	 		var a = $.extend({
	 			// width
	 			width: 300, 
				// Data type, html, js, ajax
				datatype: 'html',
				// Search text
				searchTxt: 'Recherche',
				// language
				direction: 'ltr',
				// JS Function to execute on init
				callback: function(){}
			}, b);

			return this.each(function() {
				/*==============
				// All variables
				====================*/
				// This
	    		var _this	= $(this), 
	    			_this_id= $(this).attr('id'), 
	    			multiple= ($(this).attr('multiple')=='multiple') ? true : false, 
	    			disable = ($(this).attr('disabled')=='disabled') ? true : false, 
	    			// All data
	    			zeus_all= [], 

		    		// Data
					selected, 
					disabled, 
				    selectedExist=false, 
				    setText='', 
				    setvalue='', 
				    setTextm=[], 
				    setvaluem=[], 

					setRemEvent = function(_this, _this_id) {
						$('#'+_this_id+'-tvzeus.multiple .zeus-value span').unbind('click').click(function() {
							var r=$(this).attr('name');
							$('#'+_this_id+'-tvzeus .zeus-value span[name="'+r+'"]').remove();

							var allv=$('#'+_this_id+'-tvzeus-val').val(), alln=[];
							allv=allv.split(',');
							for(var i=0; i<allv.length; i++) {
								allv[i] = allv[i].trim();
								if (allv[i]!=r && allv[i].length>0) alln.push(allv[i]);
							}

							if (alln.length>0) $('#'+_this_id+'-tvzeus-val').val(alln.join(','));
								else $('#'+_this_id+'-tvzeus-val').val('');
							$('#'+_this_id+'-tvzeus').removeClass('shown');

							$('#'+_this_id+'-tvzeus .zeus-list .zeus-elem[data-val="'+r+'"]').removeClass('selected');
							$('#'+_this_id+'-tvzeus .zeus-list .zeus-elem[data-val="'+r+'"]').attr('selected',false);

							$("#"+_this_id+" option").filter(function(){return $(this).val()==r;}).prop('selected',false);
							$("#"+_this_id+" option[value=\""+r+"\"]").attr('selected',false);
							$("#"+_this_id).change();

					    	if ($('#'+_this_id+'-tvzeus').hasClass('shown')) {
								$('#'+_this_id+'-tvzeus').toggleClass('shown');
					    	}
						});
					}, 

					inArray = function (needle, haystack) {
						var length = haystack.length;
						for(var i = 0; i < length; i++) {
							if(haystack[i] == needle) return true;
						}
						return false;
					}, 

					setValue = function(_this_id, val) {
						var mltpl=$('#'+_this_id+'-tvzeus').hasClass('multiple'), ok=false;
						if (mltpl) {
							if (Array.isArray(val)) {
								var ex=0, lst, lsts=$('#'+_this_id+'-tvzeus .zeus-list .zeus-elem');
								$('#'+_this_id+'-tvzeus .zeus-value').html('');
								$('#'+_this_id+'-tvzeus-val').val('');
								$('#'+_this_id+'-tvzeus').removeClass('shown');
								$('#'+_this_id+'-tvzeus .zeus-list .zeus-elem').removeClass('selected');

								var alln=[];
								for(var x=0; x<lsts.length; x++) {
									lst=lsts[x];
									var value = $(lst).attr('data-val');
									var text = $(lst).text();
									if (inArray(value, val)) {
										ex=1;
										$('#'+_this_id+'-tvzeus .zeus-value').append('<span name="'+value+'">'+text+'</span>');
										if (value) alln.push(val[i]);

										$('#'+_this_id+'-tvzeus').toggleClass('shown');
										$('#'+_this_id+'-tvzeus .zeus-list .zeus-elem[data-val="'+value+'"]').removeClass('selected').addClass('selected');
										$('#'+_this_id+'-tvzeus .zeus-list .zeus-elem[data-val="'+value+'"]').attr('selected','selected');

										$("#"+_this_id+" option").filter(function(){return $(this).val()==value;}).prop('selected',true);
										$("#"+_this_id+" option[value=\""+value+"\"]").attr('selected','selected');
									}
								}
								if (alln.length>0) $('#'+_this_id+'-tvzeus-val').val(alln.join(','));
								setRemEvent(_this, _this_id);
								if (ex==0) console.warn('The value '+val+' not exists for #'+_this_id);
									else {
										ok=true;
										$("#"+_this_id).change();
									}
							} else console.error('The value must be an array for a multiple select for #'+_this_id);
						} else {
							if (!Array.isArray(val)) {
								var ex=0, lst, lsts=$('#'+_this_id+'-tvzeus .zeus-list .zeus-elem');
								for(var x=0; x<lsts.length; x++) {
									lst=lsts[x];
									var value = $(lst).attr('data-val');
									var text = $(lst).text();
									if (value==val) {
										ex=1;
										$('#'+_this_id+'-tvzeus .zeus-value').html('<span name="'+value+'">'+text+'</span>');
										$('#'+_this_id+'-tvzeus-val').val(value);
										$('#'+_this_id+'-tvzeus').removeClass('shown');
										$("#"+_this_id).val(value);
				    					$("#"+_this_id+' option').removeAttr('selected');
				    					$("#"+_this_id+' option[value="'+value+'"]').attr('selected', 'selected');
										$('#'+_this_id+'-tvzeus .zeus-list .zeus-elem').removeClass('selected');
										$('#'+_this_id+'-tvzeus .zeus-list .zeus-elem[data-val="'+value+'"]').removeClass('selected').addClass('selected');
									}
								}
								if (ex==0) console.warn('The value '+val+' not exists for #'+_this_id);
									else {
										ok=true;
										$("#"+_this_id).change();
									}
							} else console.error('The value must not be an array for a single select for #'+_this_id);
						}
						return ok;
					}, 

					getValue = function(_this_id) {
						var val=$('#'+_this_id+'-tvzeus-val').val();
						return val;
					}, 

					triggerContent = function(_this_id) {
						destroy(_this_id);
            			tvzeus=$('#'+_this_id).tvzeus({
            				width: a.width, 
            				datatype: a.datatype, 
            				searchTxt: a.searchTxt, 
            				direction: a.direction, 
            				callback: a.callback
            			});
						return true;
					}, 

					unSelect = function(_this_id) {
						$('#'+_this_id+'-tvzeus .zeus-value').html('');
						$('#'+_this_id+'-tvzeus-val').val('');
    					$('#'+_this_id+'-tvzeus .zeus-list .zeus-elem').removeAttr('selected');
						$('#'+_this_id+'-tvzeus .zeus-list .zeus-elem').removeClass('selected');
    					$('#'+_this_id+' option').removeAttr('selected');
						$('#'+_this_id+'-tvzeus').removeClass('shown');
					}

					triggerValue = function(_this_id) {
						var mtp=($('#'+_this_id).attr('multiple')=='multiple')?true:false;
						$('#'+_this_id+'-tvzeus .zeus-value').html('');
						$('#'+_this_id+'-tvzeus-val').val('');
    					$('#'+_this_id+'-tvzeus .zeus-list .zeus-elem').removeAttr('selected');
    					$('#'+_this_id+'-tvzeus .zeus-list .zeus-elem').removeClass('selected');
						$('#'+_this_id+'-tvzeus').removeClass('shown');

						$('#'+_this_id).find('option').each(function() {
						    var value = $(this).val();
						    var text = $(this).text();
						    var attributes = this.attributes, selected;

						    var alln=[];
							for (var i = 0; i < attributes.length; i++) {
								if (attributes[i].name=='selected') {
									if (!mtp) {
										$('#'+_this_id+'-tvzeus .zeus-value').html('<span name="'+value+'">'+text+'</span>');
										$('#'+_this_id+'-tvzeus-val').val(value);
										$("#"+_this_id).val(value);
				    					$("#"+_this_id+' option[value="'+value+'"]').attr('selected', 'selected');
										$('#'+_this_id+'-tvzeus .zeus-list .zeus-elem[data-val="'+value+'"]').removeClass('selected').addClass('selected');
										$('#'+_this_id+'-tvzeus .zeus-list .zeus-elem[data-val="'+value+'"]').attr('selected','selected');
									} else {
										alln.push(value);
										$('#'+_this_id+'-tvzeus .zeus-value').append('<span name="'+value+'">'+text+'</span>');

										$('#'+_this_id+'-tvzeus .zeus-list .zeus-elem[data-val="'+value+'"]').removeClass('selected').addClass('selected');
										$('#'+_this_id+'-tvzeus .zeus-list .zeus-elem[data-val="'+value+'"]').attr('selected','selected');

										$("#"+_this_id+" option").filter(function(){return $(this).val()==value;}).prop('selected',true);
										$("#"+_this_id+" option[value=\""+value+"\"]").attr('selected','selected');
									}
								}
							}
							if (alln.length>0) $('#'+_this_id+'-tvzeus-val').val(alln.join(','));
						});

						if (mtp) setRemEvent(_this, _this_id);
						$("#"+_this_id).change();
						return true;
					}, 

					zDisable = function(_this_id) {
						$('#'+_this_id+'-tvzeus').attr('disabled', 'disabled');
						$('#'+_this_id+'-tvzeus').removeClass('disabled').addClass('disabled');
						return true;
					}, 

					zEnable = function(_this_id) {
						$('#'+_this_id+'-tvzeus').removeAttr('disabled');
						$('#'+_this_id+'-tvzeus').removeClass('disabled');
						return true;
					}, 

					destroy = function(_this_id) {
						$('#'+_this_id+'-tvzeus').remove();
						$("#"+_this_id).show();
						return true;
					}, 

					keyboard = function(_this_id, key) {
						zeusKeyPressSpeed = zeusKeyPressSpeed - 50;
						if (zeusKeyPressSpeed<50) zeusKeyPressSpeed=50;
						if (zeusIsKeyPressed) {
							var mtp=($('#'+_this_id).attr('multiple')=='multiple')?true:false, zzpresel;

							if ( key == 38 || key == 40 ) {// Direction
								var zznbr=$('#'+_this_id+'-tvzeus .zeus-list .zeus-elem:visible').length;
								var zzpbr=$('#'+_this_id+'-tvzeus .zeus-list .zeus-elem.pre-sel').length;
								if (zznbr>0) {
									if (zzpbr>0) {
										zzpresel=$('#'+_this_id+'-tvzeus .zeus-list .zeus-elem:eq('+zeusPreSelItem+')');
										zeusPreselVal = $(zzpresel).attr('data-val');
									} else {
										if (!mtp) {
											var zzsel=$('#'+_this_id+'-tvzeus .zeus-list .zeus-elem.selected:visible').length;
											if (zzsel>0) {
												zeusPreSelItem = $('#'+_this_id+'-tvzeus .zeus-list .zeus-elem.selected').prevAll('.zeus-elem').length;
												zzpresel=$('#'+_this_id+'-tvzeus .zeus-list').find('.zeus-elem:eq('+zeusPreSelItem+')');
												zeusPreselVal = $(zzpresel).attr('data-val');
											} else {
												zeusPreSelItem=0;
												zzpresel=$('#'+_this_id+'-tvzeus .zeus-list').find('.zeus-elem:first');
												zeusPreselVal = $(zzpresel).attr('data-val');
											}
										} else {
											zeusPreSelItem=0;
											zzpresel=$('#'+_this_id+'-tvzeus .zeus-list').find('.zeus-elem:first');
											zeusPreselVal = $(zzpresel).attr('data-val');
										}
									}
								}
							}
						    
						    if ( key == 38 ) {// Top
						    	if (zeusPreSelItem>0) {
						    		zeusPreSelItem--;
									var nzzpresel=$('#'+_this_id+'-tvzeus .zeus-list .zeus-elem:visible:eq('+zeusPreSelItem+')');
									if (nzzpresel.length > 0) {
										zzpresel=nzzpresel;
										zeusPreselVal = $(nzzpresel).attr('data-val');
										$('#'+_this_id+'-tvzeus .zeus-list .zeus-elem').removeClass('pre-sel');
										$(nzzpresel).removeClass('pre-sel').addClass('pre-sel');
										$('#'+_this_id+'-tvzeus .zeus-list').scrollTop($('#'+_this_id+'-tvzeus .zeus-list').scrollTop() + $(nzzpresel).position().top - 80);
									}
						    	}
						    }
						    if ( key == 40 ) {// Bottom
						    	if (zeusPreSelItem<zznbr) {
						    		zeusPreSelItem++;
									var nzzpresel=$('#'+_this_id+'-tvzeus .zeus-list .zeus-elem:visible:eq('+zeusPreSelItem+')');
									if (nzzpresel.length > 0) {
										zzpresel=nzzpresel;
										zeusPreselVal = $(nzzpresel).attr('data-val');
										$('#'+_this_id+'-tvzeus .zeus-list .zeus-elem').removeClass('pre-sel');
										$(nzzpresel).removeClass('pre-sel').addClass('pre-sel');
										$('#'+_this_id+'-tvzeus .zeus-list').scrollTop($('#'+_this_id+'-tvzeus .zeus-list').scrollTop() + $(nzzpresel).position().top - 80);
									}
						    	}
						    }
						    if ( key == 13 ) {// Enter
						    	var dis=$('#'+_this_id+'-tvzeus .zeus-list .zeus-elem.pre-sel').hasClass('disabled');
						    	if (zeusPreselVal && !dis) {
						    		if (!mtp) setValue(_this_id, zeusPreselVal);
					    			else {
					    				var tsv=$('#'+_this_id+'-tvzeus-val').val();
					    				tsv=tsv.split(',');
					    				tsv.push(zeusPreselVal);
					    				setValue(_this_id, tsv);
					    			}
						    	}
								zeusIsKeyPressed = false;
								zeusKeyPressSpeed = 400;
								clearInterval(zeusIntervalId);
						    }
						    if ( key == 27 ) {// Echap
						    	$('#'+_this_id+'-tvzeus .zeus-value').trigger('click');
								zeusIsKeyPressed = false;
								zeusKeyPressSpeed = 400;
								clearInterval(zeusIntervalId);
						    }
						    zeusIntervalId = setTimeout(function() {keyboard(_this_id, key)}, zeusKeyPressSpeed);
						}
					};

			/*==============
			// Columns to use
			====================*/
	    		var options=[];
				_this.find('option').each(function() {
				    var value = $(this).val();
				    var text = $(this).text();
				    var attributes = this.attributes;
				    var attributeList = {};

					for (var i = 0; i < attributes.length; i++) {
						attributeList[attributes[i].name] = attributes[i].value;
						selected=(attributes[i].name=='selected') ? true : false;
						disabled=(attributes[i].name=='disabled') ? true : false;
						if (attributes[i].name=='selected') {
							selectedExist=true;
							if (!multiple) {
								setText='<span name="'+value+'">'+text+'</span>';
								setvalue=value;
							} else {
								setTextm.push(text);
								setvaluem.push(value);
							}
						}
					}
					options.push({
						'val':value, 
						'txt':text, 
						'atr':attributeList, 
						'sel':selected, 
						'dis':disabled
					});
				});
				var n = Math.floor(Math.random() * 11);
				var k = Math.floor(Math.random() * 1000000);
				var m = 'tvzeus-'+k;
				var ide = (_this_id==undefined);
				if (ide) {
					_this_id=m;
					_this.attr('id',m);
				}

				zeus_all={
					'id':_this_id, 
					'mtp':multiple, 
					'dis':disable, 
					'slt':setText, 
					'slv':setvalue, 
					'opt':options
				};

				if (multiple && setTextm.length>0) {
					for (var i=0;i<setTextm.length;i++) {
						var tvalue='';
						for (var x=0;x<options.length;x++) {
							var lsv=options[x], 
								lsva=lsv?.['val'], 
								lsvb=lsv?.['txt'];
							if (lsvb==setTextm[i]) tvalue=lsva;
						}
						setText+='<span name="'+tvalue+'">'+setTextm[i]+'</span>';
					}
					setvalue=setvaluem.join(',');
				}

				var zeusText='\
					<div class="zeus-container'+((disable)?' disabled':'')+((multiple)?' multiple':'')+((a.direction=='rtl')?' rtl':'')+'" id="'+_this_id+'-tvzeus">\
						<div class="zeus-value">'+setText+'</div>\
						<input type="hidden" id="'+_this_id+'-tvzeus-val" value="'+setvalue+'" />\
						<div class="zeus-toshow">\
							<div class="zeus-search">\
								<input type="text" id="'+_this_id+'-search" autocomplete="off" placeholder="'+a.searchTxt+'" />\
							</div>\
							<div class="zeus-list"></div>\
						</div>\
					</div>\
				', lista='', zdirectChildren=_this.children();
				zdirectChildren.each(function() {
					var ztagName = $(this)[0].tagName;
					ztagName=ztagName.toLowerCase();
					if (ztagName=='optgroup') {
						var _grp=$(this), grplbl=_grp.attr('label');
						lista+='<div class="zeus-group"><div class="zeus-group-title">'+grplbl+'</div>';
						_grp.find('option').each(function() {
						    var value = $(this).val();
						    var text = $(this).text();
						    var attributes = this.attributes;
						    var attributeList = {}, 
						    	attribute='', selected=false, disabled=false;

							for (var i = 0; i < attributes.length; i++) {
								if (attributes[i].name!='value') attribute+=attributes[i].name+'="'+attributes[i].value+'"';
								if (attributes[i].name=='selected') selected=true;
								if (attributes[i].name=='disabled') disabled=true;
							}
							lista+='<div class="zeus-elem'+((selected)?' selected':'')+((disabled)?' disabled':'')+'" data-val="'+value+'"'+attribute+'>'+text+'</div>';
						});
						lista+='</div>';
					}
					if (ztagName=='option') {
					    var value = $(this).val();
					    var text = $(this).text();
					    var attributes = this.attributes;
					    var attributeList = {}, 
					    	attribute='', selected=false, disabled=false;

						for (var i = 0; i < attributes.length; i++) {
							if (attributes[i].name!='value') attribute+=attributes[i].name+'="'+attributes[i].value+'"';
							if (attributes[i].name=='selected') selected=true;
							if (attributes[i].name=='disabled') disabled=true;
						}
						lista+='<div class="zeus-elem'+((selected)?' selected':'')+((disabled)?' disabled':'')+'" data-val="'+value+'"'+attribute+'>'+text+'</div>';
					}
				});

				$(zeusText).insertAfter(_this);
				$('#'+_this_id+'-tvzeus').width(a.width);
				$('#'+_this_id+'-tvzeus .zeus-list').html(lista);
				_this.hide();

				$('#'+_this_id+'-tvzeus .zeus-value').click(function() {
					if (!$('#'+_this_id+'-tvzeus').hasClass('disabled')) {
						$('#'+_this_id+'-tvzeus .zeus-list .zeus-elem').show();
						$('.zeus-container:not(#'+_this_id+'-tvzeus)').removeClass('shown');
						$('#'+_this_id+'-tvzeus').toggleClass('shown');
						$('#'+_this_id+'-search').val('');
						$('#'+_this_id+'-search').focus();
					}
				});
				$('#'+_this_id+'-tvzeus .zeus-list .zeus-elem').click(function() {
					var vl=$(this).attr('data-val');
					for (var i=0;i<options.length;i++) {
						var z=options[i];
						if (z['val']==vl && !z['dis']) {
							if (multiple) {
								if (!$('#'+_this_id+'-tvzeus .zeus-list .zeus-elem[data-val="'+z['val']+'"]').hasClass('selected')) {
									$('#'+_this_id+'-tvzeus .zeus-value').append('<span name="'+z['val']+'">'+z['txt']+'</span>');
									var allv=$('#'+_this_id+'-tvzeus-val').val();
									allv=allv.split(',');
									allv.push(z['val']);
									var alln=[];
									for(var i=0; i<allv.length; i++) {
										allv[i] = allv[i].trim();
										if (parseInt(allv[i])) alln.push(allv[i]);
									}

									if (allv.length>0) $('#'+_this_id+'-tvzeus-val').val(alln.join(','));
										else $('#'+_this_id+'-tvzeus-val').val('');

									$('#'+_this_id+'-tvzeus').toggleClass('shown');
									$('#'+_this_id+'-tvzeus .zeus-list .zeus-elem[data-val="'+z['val']+'"]').removeClass('selected').addClass('selected');
									$('#'+_this_id+'-tvzeus .zeus-list .zeus-elem[data-val="'+z['val']+'"]').attr('selected','selected');

	    							$("#"+_this_id+" option").filter(function(){return $(this).val()==z['val'];}).prop('selected',true);
	    							$("#"+_this_id+" option[value=\""+z['val']+"\"]").attr('selected','selected');
									setRemEvent(_this, _this_id);
									$("#"+_this_id).change();
								}
							} else {

								$('#'+_this_id+'-tvzeus .zeus-value').html('<span name="'+z['val']+'">'+z['txt']+'</span>');
								$('#'+_this_id+'-tvzeus-val').val(z['val']);
								$('#'+_this_id+'-tvzeus').toggleClass('shown');
		    					$("#"+_this_id).val(z['val']);
		    					$("#"+_this_id+' option').removeAttr('selected');
		    					$("#"+_this_id+' option[value="'+z['val']+'"]').attr('selected', 'selected');
		    					$('#'+_this_id+'-tvzeus .zeus-list .zeus-elem').removeClass('selected');
		    					$('#'+_this_id+'-tvzeus .zeus-list .zeus-elem[data-val="'+z['val']+'"]').removeClass('selected').addClass('selected');
								$("#"+_this_id).change();
							}

						}
					}
				});

				$('#'+_this_id+'-search').on('keyup', function() {
					var searchText = $(this).val().trim().toLowerCase();
					searchText = searchText.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
					var myReg = new RegExp(searchText, "i");

					$('#'+_this_id+'-tvzeus .zeus-list .zeus-elem').each(function() {
					    var attribute = $(this).text();
					    var attribute = attribute.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

						var attributes = this.attributes, attr_txt='';
						for (var i = 0; i < attributes.length; i++) attr_txt += attributes[i].value+' ';
						attr_txt = attr_txt.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

						if (myReg.test(attribute) || myReg.test(attr_txt)) {
							$(this).show();
						} else {
							$(this).hide();
						}
					});

				});

				setRemEvent(_this, _this_id);
				$(document).on('click', function(e) {
				    if (!$(e.target).closest('#'+_this_id+'-tvzeus').length) {
				    	if ($('#'+_this_id+'-tvzeus').hasClass('shown')) {
							$('#'+_this_id+'-tvzeus .zeus-list .zeus-elem').show();
							$('#'+_this_id+'-tvzeus').toggleClass('shown');
							$('#'+_this_id+'-search').val('');
							$('#'+_this_id+'-search').focus();
				    	}
					}
				});
				$('#'+_this_id+'-tvzeus').on('click', function(e) {e.stopPropagation()});
				a.callback();

				$('#'+_this_id+'-tvzeus').keydown(function(event){
				    var key = event.which || event.keyCode;
				    if (!zeusIsKeyPressed) {
				    	zeusIsKeyPressed = true;
				    	if (key==38 || key==40 || key==13 || key==27) keyboard(_this_id, key);
				    }
				});
				$('#'+_this_id+'-tvzeus').keyup(function(event){
					zeusIsKeyPressed = false;
					zeusKeyPressSpeed = 400;
					clearInterval(zeusIntervalId);
				});

				/*==============
				// Internal function
				====================*/
				// Get all the table
				this.setValue = function(id, val) {return setValue(id, val)};
				this.getValue = function(id) {return getValue(id)};
				this.triggerContent = function(id) {return triggerContent(id)};
				this.triggerValue = function(id) {return triggerValue(id)};
				this.unSelect = function(id) {return unSelect(id)};
				this.zDisable = function(id) {return zDisable(id)};
				this.zEnable = function(id) {return zEnable(id)};
				this.destroy = function(id) {return destroy(id)};

			});
			return this;
	    };
	})(jQuery);
} else console.error('>> jQuery.js is required to use ApollonJS !! <<');
