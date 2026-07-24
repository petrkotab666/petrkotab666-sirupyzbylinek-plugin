<?php
/**
 * Plugin Name: SirupyZBylinek.cz – automatizace
 * Plugin URI: https://github.com/petrkotab666/petrkotab666-sirupyzbylinek-plugin
 * Description: Řízené affiliate a obsahové moduly pro SirupyZBylinek.cz. První modul zobrazuje tematickou kampaň produktů BrainMax v období 1. 8.–30. 9. 2026.
 * Version: 1.0.0
 * Author: Petr Kotáb
 * Requires at least: 6.0
 * Requires PHP: 7.4
 * Update URI: https://github.com/petrkotab666/petrkotab666-sirupyzbylinek-plugin
 */

defined( 'ABSPATH' ) || exit;

function szb_auto_bm_config() {
	return array(
		'from'        => '2026-08-01',
		'to'          => '2026-09-30',
		'feed'        => 'https://www.brainmarket.cz/google/export/products.xml',
		'click'       => 'https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=e9a1924a',
		'banner'      => 'https://doc.ehub.cz/b/f709cff7/04244f53.png',
		'banner_link' => 'https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=04244f53',
	);
}

function szb_auto_bm_active() {
	$config = szb_auto_bm_config();
	$today  = current_time( 'Y-m-d' );
	return $today >= $config['from'] && $today <= $config['to'];
}

function szb_auto_bm_node( $item, $name ) {
	$nodes = $item->xpath( './/*[local-name()="' . $name . '"]' );
	return empty( $nodes ) ? '' : trim( (string) $nodes[0] );
}

function szb_auto_bm_text( $value ) {
	$value = html_entity_decode( wp_strip_all_tags( (string) $value ) );
	return trim( preg_replace( '/\s+/u', ' ', $value ) );
}

function szb_auto_bm_price( $value ) {
	$value = preg_replace( '/[^0-9,.]/', '', (string) $value );
	if ( false !== strpos( $value, ',' ) && false === strpos( $value, '.' ) ) {
		$value = str_replace( ',', '.', $value );
	} elseif ( false !== strpos( $value, ',' ) && false !== strpos( $value, '.' ) ) {
		$value = str_replace( ',', '', $value );
	}
	return is_numeric( $value ) ? (float) $value : 0.0;
}

function szb_auto_bm_products() {
	$cached = get_transient( 'szb_auto_bm_products_v1' );
	if ( is_array( $cached ) ) {
		return $cached;
	}

	$config = szb_auto_bm_config();
	$result = array();
	if ( ! function_exists( 'simplexml_load_string' ) ) {
		return $result;
	}

	$response = wp_safe_remote_get(
		$config['feed'],
		array(
			'timeout'             => 15,
			'redirection'         => 3,
			'decompress'          => true,
			'limit_response_size' => 12 * 1024 * 1024,
			'headers'             => array(
				'Accept'     => 'application/xml,text/xml;q=0.9,*/*;q=0.8',
				'User-Agent' => 'SirupyZBylinek.cz affiliate module/1.0',
			),
		)
	);

	if ( is_wp_error( $response ) || 200 !== (int) wp_remote_retrieve_response_code( $response ) ) {
		set_transient( 'szb_auto_bm_products_v1', array(), 30 * MINUTE_IN_SECONDS );
		return array();
	}

	$xml = @simplexml_load_string( wp_remote_retrieve_body( $response ), 'SimpleXMLElement', LIBXML_NOCDATA | LIBXML_NONET );
	if ( false === $xml ) {
		set_transient( 'szb_auto_bm_products_v1', array(), 30 * MINUTE_IN_SECONDS );
		return array();
	}

	$items = $xml->xpath( '//*[local-name()="item" or local-name()="entry" or local-name()="SHOPITEM" or local-name()="PRODUCT"]' );
	$seen  = array();
	foreach ( array_slice( is_array( $items ) ? $items : array(), 0, 5000 ) as $item ) {
		$title    = szb_auto_bm_text( szb_auto_bm_node( $item, 'title' ) ?: szb_auto_bm_node( $item, 'PRODUCTNAME' ) );
		$brand    = szb_auto_bm_text( szb_auto_bm_node( $item, 'brand' ) ?: szb_auto_bm_node( $item, 'MANUFACTURER' ) );
		$category = szb_auto_bm_text( szb_auto_bm_node( $item, 'product_type' ) ?: szb_auto_bm_node( $item, 'CATEGORYTEXT' ) );
		$haystack = remove_accents( strtolower( $title . ' ' . $brand . ' ' . $category ) );
		if ( false === strpos( $haystack, 'brainmax' ) ) {
			continue;
		}

		$link  = szb_auto_bm_node( $item, 'link' ) ?: szb_auto_bm_node( $item, 'URL' );
		$image = szb_auto_bm_node( $item, 'image_link' ) ?: szb_auto_bm_node( $item, 'IMGURL' );
		$price = szb_auto_bm_node( $item, 'price' ) ?: szb_auto_bm_node( $item, 'PRICE_VAT' );
		$stock = strtolower( szb_auto_bm_node( $item, 'availability' ) ?: szb_auto_bm_node( $item, 'DELIVERY_DATE' ) );
		if ( '' === $title || '' === $link || '' === $image || false !== strpos( $stock, 'out of stock' ) ) {
			continue;
		}

		$key = md5( strtolower( $title . '|' . $link ) );
		if ( isset( $seen[ $key ] ) ) {
			continue;
		}
		$seen[ $key ] = true;
		$amount       = szb_auto_bm_price( $price );
		$result[]     = array(
			'title' => $title,
			'image' => esc_url_raw( $image ),
			'link'  => esc_url_raw( $config['click'] . '&desturl=' . rawurlencode( esc_url_raw( $link ) ) ),
			'price' => $amount > 0 ? number_format_i18n( $amount, abs( $amount - round( $amount ) ) > 0.001 ? 2 : 0 ) . ' Kč' : '',
		);
	}

	shuffle( $result );
	$result = array_slice( $result, 0, 24 );
	set_transient( 'szb_auto_bm_products_v1', $result, 6 * HOUR_IN_SECONDS );
	return $result;
}

function szb_auto_bm_render( $atts = array() ) {
	if ( ! szb_auto_bm_active() ) {
		return '';
	}
	$atts     = shortcode_atts( array( 'limit' => 6 ), $atts, 'szb_brainmax' );
	$limit    = max( 1, min( 12, absint( $atts['limit'] ) ) );
	$products = array_slice( szb_auto_bm_products(), 0, $limit );
	$config   = szb_auto_bm_config();

	ob_start();
	?>
	<style>
	.szb-bm{margin:34px 0;padding:24px;border:1px solid #d8e6ce;border-radius:22px;background:#f7fbf3;color:#30382d}.szb-bm *{box-sizing:border-box}.szb-bm-label{display:block;margin-bottom:8px;color:#777;font:800 10px/1.3 system-ui;text-transform:uppercase;letter-spacing:.09em}.szb-bm h2{margin:0 0 8px;color:#5d402d;font-size:clamp(1.45rem,3vw,2rem)}.szb-bm-intro{margin:0 0 20px;color:#566052}.szb-bm-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}.szb-bm-card{display:flex;flex-direction:column;overflow:hidden;border:1px solid #dbe7d4;border-radius:16px;background:#fff}.szb-bm-card>a:first-child{display:block;aspect-ratio:4/3;padding:12px}.szb-bm-card img{width:100%;height:100%;object-fit:contain}.szb-bm-body{display:flex;flex:1;flex-direction:column;padding:15px;border-top:1px solid #edf2e9}.szb-bm-body h3{margin:0 0 12px;font-size:.98rem;line-height:1.35}.szb-bm-body h3 a{color:#4f3929;text-decoration:none}.szb-bm-price{margin:auto 0 12px;color:#487426;font-size:1.15rem;font-weight:900}.szb-bm-button{display:block;padding:10px 12px;border-radius:10px;background:#689f38;color:#fff!important;text-align:center;text-decoration:none!important;font-weight:850}.szb-bm-banner{display:block;line-height:0}.szb-bm-banner img{display:block;max-width:100%;height:auto;margin:auto;border-radius:13px}.szb-bm-note{margin:14px 0 0;color:#6c7567;font-size:.82rem}@media(max-width:820px){.szb-bm-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:520px){.szb-bm{padding:18px}.szb-bm-grid{grid-template-columns:1fr}}
	</style>
	<section class="szb-bm" aria-label="Doporučené produkty BrainMax">
		<span class="szb-bm-label">Reklama</span>
		<h2>Vybrané produkty BrainMax</h2>
		<p class="szb-bm-intro">Výběr funkčních potravin, vitaminů, minerálů a produktů pro běžnou výživu. Dostupnost a aktuální cenu ověřte po otevření nabídky.</p>
		<?php if ( $products ) : ?>
			<div class="szb-bm-grid">
				<?php foreach ( $products as $product ) : ?>
					<article class="szb-bm-card">
						<a href="<?php echo esc_url( $product['link'] ); ?>" target="_blank" rel="nofollow sponsored noopener noreferrer"><img src="<?php echo esc_url( $product['image'] ); ?>" alt="<?php echo esc_attr( $product['title'] ); ?>" loading="lazy" decoding="async"></a>
						<div class="szb-bm-body"><h3><a href="<?php echo esc_url( $product['link'] ); ?>" target="_blank" rel="nofollow sponsored noopener noreferrer"><?php echo esc_html( $product['title'] ); ?></a></h3><?php if ( $product['price'] ) : ?><div class="szb-bm-price"><?php echo esc_html( $product['price'] ); ?></div><?php endif; ?><a class="szb-bm-button" href="<?php echo esc_url( $product['link'] ); ?>" target="_blank" rel="nofollow sponsored noopener noreferrer">Zobrazit nabídku</a></div>
					</article>
				<?php endforeach; ?>
			</div>
		<?php else : ?>
			<a class="szb-bm-banner" href="<?php echo esc_url( $config['banner_link'] ); ?>" target="_blank" rel="nofollow sponsored noopener noreferrer"><img src="<?php echo esc_url( $config['banner'] ); ?>" alt="BrainMarket.cz – produkty BrainMax" width="970" height="310" loading="lazy" decoding="async"></a>
		<?php endif; ?>
		<p class="szb-bm-note">Doplňky stravy nejsou náhradou pestré stravy ani odborné zdravotní péče.</p>
	</section>
	<?php
	return ob_get_clean();
}
add_shortcode( 'szb_brainmax', 'szb_auto_bm_render' );

function szb_auto_bm_relevant_post( $post ) {
	$text = remove_accents( strtolower( wp_strip_all_tags( $post->post_title . ' ' . $post->post_content ) ) );
	foreach ( array( 'horcik', 'spanek', 'regenerac', 'vitamin', 'mineral', 'kolagen', 'protein', 'superpotrav', 'energie', 'imunit', 'sport', 'adaptogen', 'probiot', 'funkcni potrav', 'vyziva', 'omega', 'zinek', 'selen', 'zelezo', 'elektrolyt' ) as $keyword ) {
		if ( false !== strpos( $text, $keyword ) ) {
			return true;
		}
	}
	return false;
}

function szb_auto_bm_append( $content ) {
	if ( ! is_singular() || ! in_the_loop() || ! is_main_query() || ! szb_auto_bm_active() ) {
		return $content;
	}
	global $post;
	if ( ! $post || false !== strpos( $content, 'szb-bm' ) || ! szb_auto_bm_relevant_post( $post ) ) {
		return $content;
	}
	return $content . szb_auto_bm_render( array( 'limit' => 6 ) );
}
add_filter( 'the_content', 'szb_auto_bm_append', 35 );
