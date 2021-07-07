<script>
	import { SideBar } from "@slimkit-ui/svelte-elements";
	
	import Icon from "fa-svelte";
	import { faCaretRight } from "@fortawesome/free-solid-svg-icons";
	import { onMount } from "svelte";
	import { menu } from "./sidebar-data.js";
	import { currentPage, pageParams } from "./stores/page.store";
	import { routeData } from "./route-data";
	import { init, navigate } from "@slimkit-ui/router";
	import zirconImg  from "../public/framework/img/zircon.png";
	
	// import Form from './pages/Form.svelte';

	let mySideBar;
	let page;
	let isSideBarCollapsed = true;
	let activeIndex =0;
	let currentPath = "/";

			
	onMount(async ()=>{
		let routingData = await init({...routeData})
		pageParams.set({...routingData.params})
		currentPage.set(routingData.module)
	})

	function sidebarCollapsed(evt) {
		isSideBarCollapsed = evt.detail;
	}

	async function activeLink(event) {
		console.log(event.detail);
		let {module, params} = await navigate(event.detail)
		console.log({module, params});
		pageParams.set({...params})
		currentPage.set(module)
	}

	function setMenuIndex() {
		activeIndex += 1;
		activeIndex = activeIndex >= Object.keys(menu).length ? 0:activeIndex;
	}

	

</script>

<style lang="scss">

	nav {
		.navbar-brand {
			.navbar-item {
				img {
					max-height: 100px;
				}
			}
		}
	}

	nav.breadcrumb {
		box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.2);
		transition: width ease-in-out 0.75s, height 2s ease-in-out 3s;
		width: 100%;
		height: auto;
	}

	@media screen and (max-width: 900px) {
		nav.breadcrumb {
			height: 0;
			// max-height: 0;
			width: 0;
		}
	}

	.spa-view {
		margin: 10px 30px;
	}

</style>

<main>

	<!-- Nav Bar -->
	<nav class="navbar testx is-primaryx" role="navigation" aria-label="main navigation">
		<div class="navbar-brand">
			<span class="navbar-item">
				<!-- src="public/framework/img/zircon.png" -->
				<img
				src={zirconImg}
				alt="branding"
				width="64"
				height="100" />
			</span>
			{#if isSideBarCollapsed}
		<a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" on:click={mySideBar.toggleShow}>
			<span aria-hidden="true"></span>
			<span aria-hidden="true"></span>
			<span aria-hidden="true"></span>
		</a>
		{/if}
			<!-- <Icon icon={faCaretRight} /> -->
		</div>
	</nav>


	<!-- Breadcrum bar -->
	<nav class="breadcrumb is-primary is-right" role="navigation" aria-label="breadcrumbs">
		<ul>
		<li><a href="#" on:click={setMenuIndex}>Current: {currentPath}</a></li>
		  <li><a href="#">Documentation</a></li>
		  <li><a href="#">Components</a></li>
		  <li class="is-active"><a href="#" aria-current="page">Breadcrumb</a></li>
		</ul>
	  </nav>
	<!-- </div> -->

	<div class="columns is-marginlessee">

		<!-- Sidebar -->
		<SideBar {menu} cssClass="column" bind:this={mySideBar} on:collapsed={sidebarCollapsed} 
		{activeIndex} on:click={activeLink} {currentPath}/>
	
			 <!-- SPA View -->
		<div class="column spa-view">
			<svelte:component this={$currentPage} {...pageParams}/>
		</div>

	</div>
</main>
