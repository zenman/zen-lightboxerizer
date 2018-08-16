<?php
/*
Plugin Name: Zen Lightboxerizer
Plugin URI:
Description: TinyMCE extender allowing gallery (and generic) lightboxing for fun and profit.
Version: 0.1.1
Author: Zenman
Author URI: https://zenman.com/
*/

defined( 'ABSPATH' ) or die( 'Huh?' );

if ( ! class_exists( 'zen_lightboxerizer' ) ) {

	class zen_lightboxerizer{
		protected $version = '0.1.1';

		public static function init() {
			$class = __CLASS__;
			new $class;
		}

		function __construct($args = array()){
			// error_log('why does this fire so many times??');

			// when an image gets added to the editor, wrap it with a targetable class if it's linked
			add_filter('image_send_to_editor', array($this, 'zen_force_wrapper_class'), 10, 9);

			/*

			Let's talk about things that didn't work here:

			custom shortcode
			forcing captions
			...overloading the anchor itself

			*/

			add_action('wp_enqueue_scripts', array($this, 'zen_lightboxerizer_enqueues'));
		}

		public function zen_force_wrapper_class($html, $id, $caption, $title, $align, $url, $size, $alt) {
			if (!$caption && $url){
				return '<span class="lightboxme">'.$html.'</span>';
			} else {
				return $html;
			}
		}

		public function zen_lightboxerizer_enqueues() {
			// wp_enqueue_style('lightboxerizer-css', plugins_url('/css/lightboxerizer.min.css', __FILE__), array(), $this->version);
			wp_enqueue_script('lightboxerizer-js', plugins_url('/js/lightboxerizer.min.js', __FILE__), array(), $this->version, true);
			wp_localize_script('lightboxerizer-js', 'lightboxerizer', array('plugindir' => plugins_url('', __FILE__)));
		}
	}
}

add_action( 'plugins_loaded', array( 'zen_lightboxerizer', 'init' ));
