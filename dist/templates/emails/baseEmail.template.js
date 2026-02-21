export function baseTemplate(content) {
    return `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;background:#000;">

<table width="100%" cellpadding="0" cellspacing="0"
style="background: linear-gradient(180deg, rgba(29,3,3,1), rgba(0,0,0,1)); padding:40px 0;">

<tr>
<td align="center">

<table width="580" cellpadding="0" cellspacing="0" style="color:#fff;">

<tr>
<td align="center" style="padding-bottom:20px;">
<img src="https://pub-b2620e54712941dbbdba57bdbcde64f7.r2.dev/Frame%20427322214.svg" width="140">
</td>
</tr>

${content}

<tr>
<td align="center" style="padding-top:25px;">
<p style="color:#777;font-size:13px;">Follow us for updates</p>

<a href="https://x.com/kisschatai" style="margin:0 8px;">
<img src="https://pub-b2620e54712941dbbdba57bdbcde64f7.r2.dev/Frame%20210%20(2).svg" width="26">
</a>

<a href="https://reddit.com" style="margin:0 8px;">
<img src="https://www.redditstatic.com/desktop2x/img/favicon/android-icon-192x192.png" width="26">
</a>

<a href="https://discord.gg/kisschatai" style="margin:0 8px;">
<img src="https://pub-b2620e54712941dbbdba57bdbcde64f7.r2.dev/Frame%20209%20(2).svg" width="26">
</a>
</td>
</tr>

<tr>
<td align="center" style="color:#444;font-size:11px;padding-top:25px;">
©️ 2026 KISSCHAT.AI — All rights reserved
</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`;
}
