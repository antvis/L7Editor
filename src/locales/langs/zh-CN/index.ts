import common from './common';
import utils from './utils';
import recoil from './recoil';
import pages from './pages';
import wkt_editor from './wkt_editor';
import save_map_options_control from './save_map_options_control';
import official_layer_control from './official_layer_control';
import location_search_control from './location_search_control';
import layer_color_control from './layer_color_control';
import filter_form_list_control from './filter_form_list_control';
import clear_control from './clear_control';
import auto_control from './auto_control';
import administrative_select_control from './administrative_select_control';
import map_content from './map_content';
import layer_popup from './layer_popup';
import geojson_editor from './geojson_editor';
import app_table from './app_table';
import app_header from './app_header';
import import_btn from './import_btn';
import btn from './btn';

export default Object.assign({}, {
  common,
  btn,
  import_btn,
  app_header,
  app_table,
  geojson_editor,
  layer_popup,
  map_content,
  administrative_select_control,
  auto_control,
  clear_control,
  filter_form_list_control,
  layer_color_control,
  location_search_control,
  official_layer_control,
  save_map_options_control,
  wkt_editor,
  pages,
  recoil,
  utils,
});