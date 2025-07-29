export function Footer() {
  return (
    <footer className="border-t bg-background py-8">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 브랜드 소개 */}
          <div>
            <h3 className="font-semibold text-lg mb-3">핀거스냅</h3>
            <p className="text-sm text-muted-foreground">
              사진에 담긴 이야기와 해석을 중심으로 공유하는<br />
              설명 기반 사진 커뮤니티 플랫폼
            </p>
          </div>

          {/* 링크 */}
          <div>
            <h3 className="font-semibold text-lg mb-3">서비스</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  서비스 소개
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  이용약관
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  개인정보처리방침
                </a>
              </li>
            </ul>
          </div>

          {/* 연락처 */}
          <div>
            <h3 className="font-semibold text-lg mb-3">연락처</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="mailto:support@fingersnap.com" className="hover:text-foreground transition-colors">
                  support@fingersnap.com
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  고객지원
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t text-center text-sm text-muted-foreground">
          <p>&copy; 2024 핀거스냅. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}