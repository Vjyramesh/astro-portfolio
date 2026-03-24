/**
 * Controls header-specific client-side behavior such as the active nav state
 * and the mobile menu toggle.
 */
class Header {
    private block: HTMLElement | null = document.querySelector('.cmp-header');
    private abortController = new AbortController();
    private hamburger: HTMLButtonElement | null | undefined = this.block?.querySelector<HTMLButtonElement>('.cmp-header__hamburger');
    private navLink:NodeListOf<HTMLAnchorElement> | null | undefined = this.block?.querySelectorAll<HTMLAnchorElement>('.cmp-header__nav-link');
    /**
     * Creates the header controller and wires up initial DOM behavior.
     */
    constructor() {
        this.init();
    }

    /**
     * Sets the initial active link and binds the hamburger button click handler.
     */
    private init(): void {
        this.setActiveLink();
        window.addEventListener('hashchange', () => this.setActiveLink(), {signal: this.abortController.signal});
        this.hamburger?.addEventListener('click', (event) => this.handleHamburger(event), {signal: this.abortController.signal});
        this.navLink?.forEach((link) => {
            link?.addEventListener('click', (event) => this.handleNavLinkClick(event), {signal: this.abortController.signal});
        });
    }

    private handleNavLinkClick(event: MouseEvent): void {
        this.closeMenu();

        // Keep the active state in sync even when hashchange is not emitted
        // during client-side navigation.
        window.requestAnimationFrame(() => this.setActiveLink());
    }

    private closeMenu(): void {
        if (window.matchMedia('(max-width: 1023px)').matches) {
            this.hamburger?.click();
        }
    }
    /**
     * Toggles the mobile navigation state and swaps the menu/close icons.
     * 
     * @param event The click event emitted by the hamburger button.
     */
    private handleHamburger(event: MouseEvent): void {
        const button = event.currentTarget as HTMLButtonElement;
        const isExpanded = button?.getAttribute('aria-expanded') === 'true';
        const menuIcon = button?.querySelector<HTMLElement>('.cmp-header__icon-menu');
        const closeIcon = button?.querySelector<HTMLElement>('.cmp-header__icon-close');

        button?.setAttribute('aria-expanded', String(!isExpanded));
        button?.setAttribute('aria-label', isExpanded ? 'Open menu' : 'Close menu');
        this.block?.querySelector('.cmp-header__nav')?.classList.toggle('block', !isExpanded);
        document.body.classList.toggle('overflow-hidden', !isExpanded);
        if (menuIcon) {
            menuIcon.hidden = !isExpanded;
        }

        if (closeIcon) {
            closeIcon.hidden = isExpanded;
        }
    }

    /**
     * Marks the nav link whose URL matches the current page URL as active.
     */
    private setActiveLink(): void {
        const currentLocation = new URL(window.location.href);
        const links = this.block?.querySelectorAll<HTMLAnchorElement>('.cmp-header__nav-link');

        links?.forEach((link) => {
            const linkUrl = new URL(link.href, window.location.origin);
            const samePath = linkUrl.pathname === currentLocation.pathname;
            const sameHash = (linkUrl.hash || '') === (currentLocation.hash || '');
            const isActive = linkUrl.hash ? samePath && sameHash : samePath && !currentLocation.hash;
            link.classList.toggle('active', isActive);
        });
    }

    /**
     * Cleans up event listeners before the header is re-initialized.
     */
    destroy(): void {
        this.abortController.abort();
    }
}

let header: Header | null = null;

const initHeader = (): void => {
    header?.destroy();
    header = new Header();
};

initHeader();
document.addEventListener('astro:page-load', initHeader);

export {};
