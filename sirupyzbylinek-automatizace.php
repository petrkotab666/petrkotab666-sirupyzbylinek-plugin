<?php
/**
 * Plugin Name: SirupyZBylinek.cz – automatizace
 * Plugin URI: https://github.com/petrkotab666/petrkotab666-sirupyzbylinek-plugin
 * Description: Řízené obsahové a affiliate moduly doplněné o soukromou statistiku návštěvnosti.
 * Version: 1.0.2
 * Author: Petr Kotáb
 * Requires at least: 6.0
 * Requires PHP: 7.4
 * Update URI: https://github.com/petrkotab666/petrkotab666-sirupyzbylinek-plugin
 */

defined( 'ABSPATH' ) || exit;

require_once __DIR__ . '/sirupyzbylinek-automatizace-core.php';

/* SZB_PRIVATE_STATS_V1 */
function szb_private_stats_enqueue() {
	if ( is_admin() ) {
		return;
	}
	wp_enqueue_script(
		'szb-private-stats',
		'https://nasekadan.cz/_nkstats/tracker.js',
		array(),
		'20260730-1',
		false
	);
}
add_action( 'wp_enqueue_scripts', 'szb_private_stats_enqueue', 1 );

function szb_private_stats_redirect() {
	$request_uri = isset( $_SERVER['REQUEST_URI'] ) ? wp_unslash( $_SERVER['REQUEST_URI'] ) : '';
	$path        = (string) wp_parse_url( $request_uri, PHP_URL_PATH );
	if ( '/statistiky' === rtrim( $path, '/' ) ) {
		wp_safe_redirect( 'https://nasekadan.cz/statistiky-webu/?site=sirupyzbylinek.cz', 302 );
		exit;
	}
}
add_action( 'template_redirect', 'szb_private_stats_redirect', 0 );
