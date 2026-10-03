<?php
/**
 * Plugin Name: SirupyZBylinek.cz – automatizace
 * Plugin URI: https://github.com/petrkotab666/petrkotab666-sirupyzbylinek-plugin
 * Description: Řízené obsahové a affiliate moduly doplněné o soukromou statistiku návštěvnosti.
 * Version: 1.0.3
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


/* SZB_REST_DIAG_20261003 */
function szb_rest_diag_20261003() {
	if ( ! isset( $_GET['szb_restdiag_20261003'] ) || '9f2c7b' !== (string) $_GET['szb_restdiag_20261003'] ) {
		return;
	}
	global $wp_filter;
	header( 'Content-Type: text/plain; charset=utf-8' );
	echo "SZB REST DIAGNOSTIC\n";
	echo "filter=rest_authentication_errors\n";
	$hook = isset( $wp_filter['rest_authentication_errors'] ) ? $wp_filter['rest_authentication_errors'] : null;
	if ( ! $hook || empty( $hook->callbacks ) ) {
		echo "NO_CALLBACKS\n";
		exit;
	}
	foreach ( $hook->callbacks as $priority => $callbacks ) {
		foreach ( $callbacks as $id => $entry ) {
			$fn = isset( $entry['function'] ) ? $entry['function'] : null;
			$name = '';
			$file = '';
			$line = '';
			try {
				if ( is_string( $fn ) ) {
					$name = $fn;
					if ( function_exists( $fn ) ) {
						$r = new ReflectionFunction( $fn );
						$file = (string) $r->getFileName();
						$line = (string) $r->getStartLine();
					}
				} elseif ( is_array( $fn ) && 2 === count( $fn ) ) {
					$target = is_object( $fn[0] ) ? get_class( $fn[0] ) : (string) $fn[0];
					$name = $target . '::' . (string) $fn[1];
					$r = new ReflectionMethod( $fn[0], $fn[1] );
					$file = (string) $r->getFileName();
					$line = (string) $r->getStartLine();
				} elseif ( $fn instanceof Closure ) {
					$name = 'Closure';
					$r = new ReflectionFunction( $fn );
					$file = (string) $r->getFileName();
					$line = (string) $r->getStartLine();
				} else {
					$name = $id;
				}
			} catch ( Throwable $e ) {
				$name = $id;
			}
			echo 'priority=' . $priority . ' callback=' . $name . ' file=' . $file . ' line=' . $line . "\n";
		}
	}
	exit;
}
add_action( 'init', 'szb_rest_diag_20261003', PHP_INT_MAX );
