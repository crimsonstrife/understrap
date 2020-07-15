<?php
/**
 * Jetpack Compatibility File
 *
 * @link https://jetpack.me/
 * @package UnderStrap
 */

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

/**
 * Jetpack setup function.
 *
 * Add theme support for a variety of Jetpack features, and assign their
 * callback functions.
 *
 * @uses add_theme_support
 * @link https://jetpack.com/support/infinite-scroll/
 * @link https://jetpack.com/support/responsive-videos/
 * @return void
 */

add_action( 'after_setup_theme', 'understrap_components_jetpack_setup' );

if ( ! function_exists( 'understrap_components_jetpack_setup' ) ) {
	/**
	 * Jetpack setup function.
	 *
	 * @link https://jetpack.me/support/infinite-scroll/
	 * @link https://jetpack.me/support/responsive-videos/
	 * @link https://jetpack.me/support/social-menu/
	 */
	function understrap_components_jetpack_setup() {
		/**
		 * Add theme support for Infinite Scroll.
		 *
		 * Pulls the next posts automatically into view when the reader
		 * approaches the bottom of the page.
		 */
		add_theme_support(
			'infinite-scroll',
			array(
				'container'      => 'main', // the ID of the HTML element to add additional posts to.
				'footer'         => 'page', // jetpack will add a footer matching the width of `page`.
				'footer_widgets' => 'footerfull', // ID of the sidebar containing footer widgets.
				'render'         => 'understrap_components_infinite_scroll_render',
			)
		);

		// Add theme support for Responsive Videos.
		add_theme_support( 'jetpack-responsive-videos' );

		// Add theme support for Social Menus.
		add_theme_support( 'jetpack-social-menu' );
	}
}

if ( ! function_exists( 'understrap_components_infinite_scroll_render' ) ) {
	/**
	 * Custom render function for Infinite Scroll.
	 */
	function understrap_components_infinite_scroll_render() {
		while ( have_posts() ) {
			the_post();
			if ( is_search() ) :
				get_template_part( 'loop-templates/content', 'search' );
			else :
				get_template_part( 'loop-templates/content', get_post_format() );
			endif;
		}
	}
}

if ( ! function_exists( 'understrap_components_social_menu' ) ) {
	/**
	 * Display Jetpack's social menu if available.
	 * Avoids fatal errors if Jetpack isn’t activated.
	 */
	function understrap_components_social_menu() {
		if ( ! function_exists( 'jetpack_social_menu' ) ) {
			// Return early if social menu is not available.
			return;
		} else {
			jetpack_social_menu();
		}
	}
}
