window.addEventListener('load', function() {
	window.removeEventListener('load', arguments.callee, false);

	if ('BookmarksCommand' in window) { // Firefox 2
		eval('BookmarksCommand.openGroupBookmark = '+
			BookmarksCommand.openGroupBookmark.toSource().replace(
				/(tabPanels\[index\])(\.loadURI\(uri\);)/,
				<><![CDATA[
					$1$2
					if (!doReplace &&
						TreeStyleTabService.getTreePref('openGroupBookmarkAsTabSubTree') &&
						!browser.treeStyleTab.parentTab) {
						browser.treeStyleTab.partTab(browser.mTabContainer.childNodes[index]);
						TreeStyleTabService.readyToOpenChildTab($1, true);
					}
				]]></>
			).replace(
				'browser.addTab(uri);',
				<><![CDATA[
					var openedTab = $&
					if (!doReplace &&
						TreeStyleTabService.getTreePref('openGroupBookmarkAsTabSubTree') &&
						!browser.treeStyleTab.parentTab) {
						TreeStyleTabService.readyToOpenChildTab(openedTab, true);
					}
				]]></>
			).replace(
				'if (index == index0)',
				<><![CDATA[
					TreeStyleTabService.stopToOpenChildTab(browser);
					$&]]></>
			)
		);
	}

	if ('PlacesUtils' in window) { // Firefox 3
		eval('PlacesUtils._openTabset = '+
			PlacesUtils._openTabset.toSource().replace(
				'browserWindow.getBrowser().loadTabs(',
				<><![CDATA[
					if (TreeStyleTabService.getTreePref('openGroupBookmarkAsTabSubTree') &&
						where.indexOf('tab') == 0)
						TreeStyleTabService.readyToOpenNewTabGroup();
					$&]]></>
			)
		);
	}
}, false);
