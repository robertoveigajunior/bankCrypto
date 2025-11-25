<?php
/**
 * Plugin Name: Bank Crypto Dashboard
 * Description: A React-based Crypto Dashboard with Cyberpunk aesthetics. Use [bank_crypto_dashboard] shortcode to display.
 * Version: 1.0.0
 * Author: Bank Crypto Team
 */

if (!defined('ABSPATH')) {
    exit;
}

function bank_crypto_enqueue_scripts() {
    $plugin_dir_url = plugin_dir_url(__FILE__);
    $plugin_dir_path = plugin_dir_path(__FILE__);
    
    // Scan for the main JS and CSS files in the assets directory
    // Vite generates files with hashes, so we need to find them dynamically
    $js_files = glob($plugin_dir_path . 'assets/*.js');
    $css_files = glob($plugin_dir_path . 'assets/*.css');

    if (!empty($js_files)) {
        $js_file = basename($js_files[0]);
        wp_enqueue_script(
            'bank-crypto-js',
            $plugin_dir_url . 'assets/' . $js_file,
            array(),
            '1.0.0',
            true
        );
    }

    if (!empty($css_files)) {
        $css_file = basename($css_files[0]);
        wp_enqueue_style(
            'bank-crypto-css',
            $plugin_dir_url . 'assets/' . $css_file,
            array(),
            '1.0.0'
        );
    }
}

function bank_crypto_shortcode() {
    // Enqueue scripts only when shortcode is used
    bank_crypto_enqueue_scripts();
    return '<div id="bank-crypto-root" class="bank-crypto-plugin-root" style="width: 100%; max-width: 100%; overflow-x: hidden; margin: 0; padding: 0;"></div>';
}

add_shortcode('bank_crypto_dashboard', 'bank_crypto_shortcode');
