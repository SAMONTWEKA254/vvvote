<?php

class Auth {
	var $db;
	
	/**
	 * creates the connection to the database
	 */
	function __construct() {
		
	}
	
	/**
	 * return server credentials which are added to the answer to the voter
	 * it can also return a nonce or one time pad to be transformed by the voter
	 * in order to check voter credentials
	 */
	function addCredentials()  {
		
	}
	
	/**
	 * check the credentials sent from the voter
	 */
	function checkCredentials($credentials) {
		
	}
	
	/**
	 * Import the list of voters and associated credentials into the database
	 */
	function importCredentials($voterlist) {
		
	}
	
	/**
	 * Return the html5 code to be integrated into the webpage 
	 * For the correct application use stylesheet use id="password" and id="username"
	 */
	function getAuthHtml() {
		
	}
	
}


?>