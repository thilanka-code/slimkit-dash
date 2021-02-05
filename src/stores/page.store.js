import { writable } from 'svelte/store';
// Below value must be a false value otherwise <svelte:component this={$currentPage} will throw error
export const currentPage = writable(null) //Tracks the current page being selected